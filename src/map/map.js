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

        this.mapTopOffset = 0
        this.mapLeftOffset = 0
        this.mapTopOffset = this.rings*this.tileHeight
        this.mapLeftOffset = this.rings*this.tileWidth

        this.rootGroup = createGroup(this)
        this.rootGroup.x = this.mapLeftOffset
        this.rootGroup.y = this.mapTopOffset
        // this.centerViewport({x:0,y:0})

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


        // safeDist is used to optimize out of map check.
        // If unit distance to origin is <= safedist, it's not out of map.
        // This avoids more complicated checks. Any better idea?
        let r = this.rings,
            t = this.transitionRings
        this.safeDist = r-1 + Math.floor(r/2)*(r+Math.floor(t/2)-t) + Math.floor((r-1)/2)*(2*r-1-t)
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
    toSector(coords) {
        // return cubeToAxial(cubeRound(axialToCube(this.toFarCoords(coords))))
        return this.toFarCoords(coords)
    }

    // Center viewport to an axial coord
    centerViewport(center) {
        let screen = this.axialToPixelPointy(center)
        this.nearRootGroup.x = -screen.x
        this.nearRootGroup.y = -screen.y
    }

    addUnit(unit) {
        let sprite = this.addSprite(this.nearUnitsGroup, unit.coords, unit.tile)
        return sprite
    }

    generate () {
        this.createFarTiles({x:0, y:0, z:0})
        this.toggleHeighmap()
        this.closeFarMap()
        let initial = {x:0, y:0}
        this.player = new Player(this, initial)
        this.zoomInCoords(initial)

        this.playerIcon = this.addSprite(this.farUnitsGroup, initial, this.player.tile)
        this.game.add.tween(this.playerIcon).to( { alpha: 0.2 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true)

        new Cattle(this, {x:2,y:2})
        new Cattle(this, {x:4,y:4})
        new Cattle(this, {x:0,y:4})
        new Cattle(this, {x:0,y:-2})
        new Cutter(this, {x:1,y:-2})
        new Businessman(this, {x:3,y:-2})
    }

    updateIconCoords() {
        if (this.playerIcon) {
            let icon = this.playerIcon,
                screenCoords = this.axialToPixelFlat(this.zoomedCoordsFar)
            icon.x = screenCoords.x
            icon.y = screenCoords.y
        }
    }

    toggleHeighmap() {
        this.heightmap.toggle()
    }

    // receives axial coords and get the right tile from the group array
    getTile(group, x, y) {
        return group.getAt(
            x + y*(4*this.rings-Math.abs(y)-1)/2 + Math.floor(group.length/2)
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

    // commonTile(tile) {
    //     tile.coords = coords
    //     tile.map = this
    //     tile.inputEnabled = true
    //     tile.input.useHandCursor = true
    //     tile.input.pixelPerfectOver = true
    //     tile.events.onInputOver.add(over, this)
    //     tile.events.onInputOut.add(out, this)
    // }

    // createFarTile(group, coords) {
    //     let pixelCoords = this.axialToPixelFlat(coords),
    //         noiseCoords = this.toNearCoords(coords),

    //         noise = getNoise(noiseCoords.x, noiseCoords.y),
    //         tile = this.addSprite(group, pixelCoords)


    //     tile.frame = 18
    //     if (noise > .1) tile.frame = 17
    //     if (noise > .6) tile.frame = 16
    //     if (noise > .8) tile.frame = 15
    //     if (noise > .9) tile.frame = 15

    //     // tile.input.pixelPerfectClick = true
    //     // tile.events.onInputUp.add(clicked, this)

    //     return tile
    // }

    // createNearTile(group, coords, sector) {
    //     let pixelCoords = this.axialToPixelPointy(coords),
    //         noiseCoords = coords

    //     let noise = getNoise(noiseCoords.x, noiseCoords.y)
    //     let tile = this.addSprite(group, pixelCoords)
    //     tile.coords = coords
    //     tile.map = this

    //     tile.sector = sector

    //     tile.frame = 3
    //     if (noise > .1) tile.frame = 2
    //     if (noise > .6) tile.frame = 1
    //     if (noise > .8) tile.frame = 0
    //     if (noise > .9) tile.frame = 0

    //     // let d = cubeDistance(axialToCube(coords), {x:0,y:0,z:0})
    //     // if (d <= (this.rings-1)) tile.alpha=0.75
    //     // if (d <= (this.rings-this.transitionRings-1)) tile.alpha=0.85
    //     // tile.alpha = Math.abs(sector.x)/5 + Math.abs(sector.y)/10

    //     return tile
    // }

    createFarTiles(center) {
        forEachHexInDist(
            center,
            this.rings-1,
            (coords) => new FarTile(this, coords, this.farMapGroup)
        )
    }

    createNearTiles(center) {
        let sector = this.toFarCoords(center)
        console.log('NEAR!', center)
        forEachHexInDist(
            center,
            this.rings-1,
            (coords) => new NearTile(this, coords, this.nearMapGroup, sector)
        )
    }

    zoomInCoords(coords) {
        console.log(coords, this.getTile(this.farMapGroup, coords.x, coords.y).coords)
        this.zoomInTile(this.getTile(this.farMapGroup, coords.x, coords.y))
    }

    zoomInTile(tile) {
        if (this.zoomedCoordsFar != tile.coords) {
            if (this.nearMapGroup) {
                this.nearMapGroup.destroy()
            }
            this.nearMapGroup = createGroup(this, this.nearRootGroup)
            this.nearMapGroup.z = 1
            this.zoomedCoordsFar = tile.coords
            this.zoomedCoordsNear = this.toNearCoords(tile.coords)
            this.nearRootGroup.sort('z', Phaser.Group.SORT_ASCENDING)
            this.centerViewport(this.zoomedCoordsNear)
            this.updateIconCoords()
            this.createNearTiles(axialToCube(this.zoomedCoordsNear))
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

    getNearestSector(coords) {
        // Uses zoomedCoordsFar as starting point for neighbors ! NOT ANYMORE
        // let far = this.zoomedCoordsFar,
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

        // Check if is leaving map (the nearest valid sector is too far)
        if (d < this.rings)
            return nearestNeighbor
        else
            return null
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
            let newSector = this.getNearestSector(coords)
            if (newSector) this.zoomInCoords(newSector)
            return newSector
        }
        return false
    }

    moveUnit(coords, direction) {
        let newCoords = translate(coords, direction)

        // Cheap check first
        if (axialDistance(newCoords) > this.safeDist) {
            if (!this.getNearestSector(newCoords)) throw 'outOfWorld'
        }
        return newCoords
    }

    update(input) {
    }
}
