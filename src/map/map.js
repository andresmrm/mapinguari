/*
  Based on: http://www.redblobgames.com/grids/hexagons/
  */

import Phaser from 'phaser-ce'

import {getNoise} from '../noiser'
import Player from '../units/player'
import Cattle from '../units/cattle'

import Heightmap from './heightmap'
import {pointyDirections, createGroup, axialDistance, cubeToAxial, axialToCube,
        invMatrix, cubeRound} from './utils'


function over(tile) {
    tile.previousAlpha = tile.alpha
    tile.alpha = 0.5
    window.overCoords = tile.coords
    window.overSector = tile.sector
    if (tile.sector)
        window.overSectorCubeRound = cubeToAxial(cubeRound(axialToCube(tile.sector)))
}
function out(tile) {
    tile.alpha = tile.previousAlpha
}
function clicked(tile) {
    console.log(tile.x, tile.y)
    tile.map.zoomInTile(tile)
}


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
        this.nearUnitsGroup.z = 20
        this.nearRootGroup.exists = false

        this.farRootGroup = createGroup(this, this.rootGroup)
        this.farMapGroup = createGroup(this, this.farRootGroup)
        this.farRootGroup.exists = false

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
        this.createTiles(this.farMapGroup, {x:0, y:0, z:0})
        this.toggleHeighmap()
        this.closeFarMap()
        let initial = {x:0, y:0}
        this.player = new Player(this, initial)
        this.zoomInCoords(initial)
        new Cattle(this, {x:2,y:2})
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
        sprite.anchor.x = 0.5
        sprite.anchor.y = this.tileCenterHeight / this.tileSpriteHeight
        return sprite
    }

    createTile(group, coords, zoomable) {
        let pixelCoords = null,
            noiseCoords = null
        if (zoomable) {
            pixelCoords = this.axialToPixelFlat(coords)
            noiseCoords = this.toNearCoords(coords)

        } else {
            pixelCoords = this.axialToPixelPointy(coords)
            noiseCoords = coords
        }

        let noise = getNoise(noiseCoords.x, noiseCoords.y)

        let tile = this.addSprite(group, pixelCoords)
        tile.coords = coords
        tile.map = this
        tile.frame = 0

        if (noise > .01) tile.frame = 4
        if (noise > .6) tile.frame = 2
        if (noise > .8) tile.frame = 3
        if (noise > .9) tile.frame = 3

        if (zoomable) {
            tile.frame = 15
            if (noise > .01) tile.frame = 16
            if (noise > .6) tile.frame = 17
            if (noise > .8) tile.frame = 18
            if (noise > .9) tile.frame = 18
        }

        // let d = cubeDistance(axialToCube(coords), {x:0,y:0,z:0})
        // if (d <= (this.rings-1)) tile.alpha=0.75
        // if (d <= (this.rings-this.transitionRings-1)) tile.alpha=0.85
        // tile.alpha = Math.abs(sector.x)/5 + Math.abs(sector.y)/10

        if (!zoomable) {
            tile.sector = this.toSector(coords)
        }

        tile.inputEnabled = true
        tile.input.useHandCursor = true
        tile.input.pixelPerfectOver = true
        tile.input.pixelPerfectClick = true
        tile.events.onInputOver.add(over, this)
        tile.events.onInputOut.add(out, this)
        if (zoomable) tile.events.onInputUp.add(clicked, this)

        return tile
    }

    createTiles(group, center, zoomable=true) {
        let N = this.rings-1,
            {x:cx,y:cy,z:cz} = center

        for (var dz=-N; dz <= N; dz++) {
            for (var dx=Math.max(-N, -dz-N); dx <= Math.min(N, -dz+N); dx++) {
                let dy = -dx-dz
                let cubic = {x: cx+dx, y: cy+dy, z: cz+dz}
                this.createTile(
                    group,
                    cubeToAxial(cubic),
                    zoomable
                )
            }
        }
    }

    zoomInCoords(coords) {
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
            this.createTiles(
                this.nearMapGroup,
                axialToCube(this.zoomedCoordsNear),
                false
            )
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
        let far = this.toFarCoords(coords),
            d = this.rings*100,
            nearestNeighbor = null,
            neighbor = null,
            newD = null

        far.x = Math.round(far.x)
        far.y = Math.round(far.y)
        far = this.zoomedCoordsFar

        for (let key in pointyDirections) {
            var dir = pointyDirections[key]
            neighbor = {x:far.x+dir.x, y:far.y+dir.y}
            newD = axialDistance(this.toNearCoords(neighbor), coords)
            if (newD < d) {
                d = newD
                nearestNeighbor = neighbor
            }
        }
        return nearestNeighbor
    }

    checkSectorChange(coords) {
        let d = axialDistance(coords, this.zoomedCoordsNear)
        if (d > this.hardRings) this.zoomInCoords(this.getNearestSector(coords))
    }

    update(input) {
    }
}
