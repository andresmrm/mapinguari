/*
  Based on: http://www.redblobgames.com/grids/hexagons/
*/

import Phaser from 'phaser-ce'

import {getNoise} from '../noiser'
import Player from '../units/player'
import Cattle from '../units/cattle'
import Cutter from '../units/cutter'
import Businessman from '../units/businessman'

import Heightmap from './heightmap'
import Store from './store'
import {FarTile, NearTile} from './tiles'
import {pointyDirections, createGroup, axialDistance, cubeToAxial, axialToCube,
        invMatrix, cubeRound, translate, forEachHexInDist} from './utils'


export class Map {
    constructor (game) {
        this.game = game

        this.tileSpriteWidth = 32
        this.tileWidth = this.tileSpriteWidth

        this.tileSpriteHeight = 48
        this.tileCenterHeight = 31 // from top to the center
        this.tileHeight = 28
        this.tilePointyHeightVariationPerRow = 20
        this.tileFlatWidthVariationPerColumn = 26

        // TODO: Allow different number of far and near rings
        this.rings = 8
        this.farRings = this.rings
        this.nearRings = this.rings

        this.numTilesPerSector = 3*this.nearRings*this.nearRings-3*this.nearRings+1

        this.mapTopOffset = this.rings*this.tileHeight
        this.mapLeftOffset = this.rings*this.tileWidth

        this.rootGroup = createGroup(this)

        this.nearRootGroup = createGroup(this, this.rootGroup)
        this.nearUnitsGroup = createGroup(this, this.nearRootGroup)
        this.nearUnitsGroup.z = 2
        this.nearRootGroup.exists = false

        this.farRootGroup = createGroup(this, this.rootGroup)
        this.farMapGroup = createGroup(this, this.farRootGroup)
        this.farUnitsGroup = createGroup(this, this.farRootGroup)
        this.farUnitsGroup.z = 2
        this.farRootGroup.exists = false
        this.farRootGroup.sort('z', Phaser.Group.SORT_ASCENDING)

        // Rings that will be shown to more than one sector
        this.transitionRings = 5

        // Inside these rings you're closer to one sector than any other.
        // After they, you can be at the same distance to 2 or 3 sectors.
        this.hardRings = this.rings - Math.ceil(this.transitionRings/2)

        // Multiply this by vector to scale from far to near
        this.farToNearMatrix = [
            this.hardRings, -this.hardRings,
            this.hardRings, 2*this.hardRings
        ]
        // Multiply this by vector to scale from near to far
        this.nearToFarMatrix = invMatrix(this.farToNearMatrix)

        // TODO: Remove? Only heightmap uses this?
        this.rows = this.rings*2-1
        this.columns = 2*this.rings-1

        this.heightmap = new Heightmap(this)

        this.needToUpdateNearMap = false
        this.needToUpdateFarMap = []

        this.microData = new Store({
            devastation: 0,
        })

        // safeDist is used to optimize out of map check.
        // If unit distance to origin is <= safedist, it's not out of map.
        // This avoids more complicated checks. Any better idea?
        let r = this.rings,
            t = this.transitionRings
        this.safeDist = r-1 + Math.floor(r/2)*(r+Math.floor(t/2)-t) + Math.floor((r-1)/2)*(2*r-1-t)

        // TODO: Debug
        window.map = this
    }

    // From near to far coords
    toFarCoords(coords) {
        let m = this.nearToFarMatrix,
            x = m[0] * coords.x + m[1] * coords.y,
            y = m[2] * coords.x + m[3] * coords.y
        return {x, y}
    }

    // From far to near coords
    toNearCoords(coords) {
        let m = this.farToNearMatrix,
            x = m[0] * coords.x + m[1] * coords.y,
            y = m[2] * coords.x + m[3] * coords.y
        return {x, y}
    }

    // From near coords to far rounded coords
    toSectorCoords(coords) {
        return cubeToAxial(cubeRound(axialToCube(this.toFarCoords(coords))))
        // return this.toFarCoords(coords)
    }

    // Center viewport to an axial coord
    centerViewport(center) {
        let screen = this.axialToPixelPointy(center)
        this.nearRootGroup.x = -screen.x
        this.nearRootGroup.y = -screen.y
    }

    centerMapOnScreen(height, width) {
        this.rootGroup.x = width/2
        this.rootGroup.y = height/2
    }

    addUnit(unit) {
        let sprite = this.addSprite(this.nearUnitsGroup, unit.coords, unit.tile)
        return sprite
    }

    generate () {
        this.createFarTiles({x:0, y:0})
        this.toggleHeighmap()
        this.closeFarMap()
        let initial = {x:0, y:0}
        this.player = new Player(this, initial)
        this.zoomInCoords(initial)

        this.playerIcon = this.addSprite(
            this.farUnitsGroup, initial, this.player.tile)
        // Shine the icon
        this.game.add.tween(this.playerIcon).to(
            { alpha: 0.2 }, 1000, Phaser.Easing.Linear.None,
            true, 0, 1000, true)

        new Cutter(this, {x:1,y:-2})
        new Businessman(this, {x:3,y:-2})
    }

    updateIconCoords() {
        if (this.playerIcon) {
            let icon = this.playerIcon,
                screenCoords = this.axialToPixelFlat(this.zoomedSector.coords)
            icon.x = screenCoords.x
            icon.y = screenCoords.y
        }
    }

    toggleHeighmap() {
        this.heightmap.toggle()
    }

    // receives axial coords and get the right tile from the group array
    getSector(coords) {
        return this.farMapGroup.getAt(
            coords.x + coords.y*(4*this.rings-Math.abs(coords.y)-1)/2 +
                Math.floor(this.farMapGroup.length/2)
        )
    }

    // hex to pixel - pointy top
    axialToPixelPointy(coords) {
        let x = this.tileWidth * (coords.x + coords.y/2),
            y = this.tilePointyHeightVariationPerRow * coords.y
        return {x, y}
    }

    // hex to pixel - flat top
    axialToPixelFlat(coords) {
        let x = this.tileFlatWidthVariationPerColumn * coords.x,
            y = this.tileHeight * (coords.y + coords.x/2)
        return {x, y}
    }

    addSprite(group, coords, tile=0) {
        let sprite = group.create(coords.x, coords.y, 'tiles', tile)
        this.setAnchor(sprite)
        return sprite
    }

    setAnchor(sprite) {
        sprite.anchor.x = 0.5
        sprite.anchor.y = this.tileCenterHeight / this.tileSpriteHeight
    }

    createFarTiles(center) {
        forEachHexInDist(
            center,
            this.rings-1,
            (coords) => new FarTile(this, coords, this.farMapGroup)
        )
    }

    createNearTiles(center) {
        let sector = this.getSector(this.toFarCoords(center))
        forEachHexInDist(
            center,
            this.rings-1,
            (coords) => new NearTile(this, coords, this.nearMapGroup, sector)
        )
    }

    zoomInCoords(coords) {
        this.zoomInSector(this.getSector(coords))
    }

    zoomInSector(sector) {
        if (this.zoomedSector != sector) {
            if (this.nearMapGroup) {
                this.nearMapGroup.destroy()
            }
            this.nearMapGroup = createGroup(this, this.nearRootGroup)
            this.nearMapGroup.z = 1
            this.zoomedSector = sector
            this.zoomedCoordsNear = this.toNearCoords(sector.coords)
            this.nearRootGroup.sort('z', Phaser.Group.SORT_ASCENDING)
            this.centerViewport(this.zoomedCoordsNear)
            this.updateIconCoords()
            this.createNearTiles(this.zoomedCoordsNear)
            this.displayOnlyNearUnits()
        }
    }

    openFarMap() {
        this.nearRootGroup.visible = false
        this.farRootGroup.visible = true
    }

    closeFarMap() {
        this.farRootGroup.visible = false
        this.nearRootGroup.visible = true
    }

    toggleFarMap() {
        if (this.farRootGroup.visible) this.closeFarMap()
        else this.openFarMap()
    }

    // Ignores if is near to map border
    getNearestSectorCoords(coords) {
        return this.getNearestSectorAndDist(coords).nearestNeighbor
    }

    getNearestSector(coords) {
        return this.getSector(this.getNearestSectorCoords(coords))
    }

    getNearestSectorChecking(coords) {
        let {nearestNeighbor, d} = this.getNearestSectorAndDist(coords)

        // Check if is leaving map (the nearest valid sector is too far)
        if (d < this.rings)
            return nearestNeighbor
        else
            return null
    }

    getNearestSectorAndDist(coords) {
        let far = cubeToAxial(cubeRound(axialToCube(this.toFarCoords(coords)))),
            d = axialDistance(this.toNearCoords(far), coords),
            nearestNeighbor = far,
            neighbor = null,
            newD = null

        // Check if initial sector is invalid
        if (axialDistance(far, {x:0,y:0}) >= this.rings) {
            d = this.rings*2
            nearestNeighbor = null
        }

        for (let key in pointyDirections) {
            var dir = pointyDirections[key]
            neighbor = {x:far.x+dir.x, y:far.y+dir.y}

            // Check if is a valid neighbor
            if (axialDistance(neighbor) < this.rings) {

                newD = axialDistance(this.toNearCoords(neighbor), coords)
                if (newD < d) {
                    d = newD
                    nearestNeighbor = neighbor
                }
            }
        }

        return {nearestNeighbor, d}
    }

    displayOnlyNearUnits() {
        this.nearUnitsGroup.forEach((sprite) => sprite.unit.checkUnitInViewport())
    }

    checkCoordsInViewport(coords) {
        return axialDistance(coords, this.zoomedCoordsNear) < this.rings
    }

    // If needed, change current displayed sector to better acomodate
    // coords.
    // Returns:
    // - the new sector, if it whas changed
    // - false if no change was needed
    // - null if attepted change, but was out of world
    changeSector(coords) {
        let d = axialDistance(coords, this.zoomedCoordsNear)
        if (d > this.hardRings) {
            let newSector = this.getNearestSectorChecking(coords)
            if (newSector) this.zoomInCoords(newSector)
            return newSector
        }
        return false
    }

    moveUnit(coords, direction) {
        let newCoords = translate(coords, direction)

        // Cheap check first
        if (axialDistance(newCoords) > this.safeDist) {
            if (!this.getNearestSectorChecking(newCoords)) throw 'outOfWorld'
        }
        return newCoords
    }

    update(input) {
        // This avoids updating near maps multiple times per turn.
        if (this.needToUpdateNearMap) {
            this.updateNearMap()
            this.needToUpdateNearMap = false
        }

        // This avoids updating far maps multiple times per turn or
        // when it's not visible.
        if (this.farRootGroup.visible && this.needToUpdateFarMap.length) {
            this.needToUpdateFarMap.forEach((sector) => {sector.updateFrame()})
            this.needToUpdateFarMap = []
        }
    }

    // Update all tiles in near map
    updateNearMap() {
        this.nearMapGroup.forEach((tile) => tile.updateFrame())
    }

    devastate(coords, range) {
        forEachHexInDist(
            coords, range,
            (coords) => {
                this.microData.get(coords, true).devastation++

                if (axialDistance(coords, this.zoomedCoordsNear) < this.nearRings)
                    this.needToUpdateNearMap = true

                let sector = this.getSector(this.toSectorCoords(coords))
                if (sector != -1 && this.needToUpdateFarMap.indexOf(sector) == -1)
                    this.needToUpdateFarMap.push(sector)
            })
    }

    // TODO: Não estava usando os 4 tiles! Pelo menos o n=3 era muito raro. Mas assim talvez ultrapasse o valor válido...
    // Returns florest level for a near tile
    getNearFlorestLevel(coords) {
        let noise = getNoise(coords.x, coords.y),
            level = Math.round(noise*3+1) - this.microData.get(coords).devastation
        return level<0 ? 0 : level
    }
    getFarFlorestLevel(coords, noise) {
        let devastation = 0
        forEachHexInDist(
            this.toNearCoords(coords),
            this.nearRings-1,
            (coords) => {devastation += this.microData.get(coords).devastation}
        )
        let level = Math.round(noise*3+1) - devastation/this.numTilesPerSector
        return level<0 ? 0 : level
    }
}
