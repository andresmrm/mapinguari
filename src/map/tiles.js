import Phaser from 'phaser-ce'

import {getNoise} from '../noiser'
import {cubeToAxial, axialToCube, cubeRound} from './utils'


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


export class Tile extends Phaser.Sprite {
    constructor (map, pixelCoords, mapCoords, group) {
        super(map.game, pixelCoords.x, pixelCoords.y, 'tiles')
        group.add(this)

        this.coords = mapCoords
        this.map = map
        this.map.setAnchor(this)

        this.inputEnabled = true
        this.input.useHandCursor = true
        this.input.pixelPerfectOver = true
        this.events.onInputOver.add(over, this)
        this.events.onInputOut.add(out, this)
    }
}


export class FarTile extends Tile {
    constructor (map, mapCoords, group) {
        let pixelCoords = map.axialToPixelFlat(mapCoords),
            noiseCoords = map.toNearCoords(mapCoords),
            noise = getNoise(noiseCoords.x, noiseCoords.y)

        super(map, pixelCoords, mapCoords, group)

        this.frame = 18
        if (noise > .1) this.frame = 17
        if (noise > .6) this.frame = 16
        if (noise > .8) this.frame = 15
        if (noise > .9) this.frame = 15

        // this.input.pixelPerfectClick = true
        // this.events.onInputUp.add(clicked, this)
    }
}


export class NearTile extends Tile {
    constructor (map, mapCoords, group, sector) {
        let pixelCoords = map.axialToPixelPointy(mapCoords),
            noiseCoords = mapCoords,
            noise = getNoise(noiseCoords.x, noiseCoords.y)

        super(map, pixelCoords, mapCoords, group)

        this.sector = sector

        this.frame = 3
        if (noise > .1) this.frame = 2
        if (noise > .6) this.frame = 1
        if (noise > .8) this.frame = 0
        if (noise > .9) this.frame = 0

        // let d = cubeDistance(axialToCube(coords), {x:0,y:0,z:0})
        // if (d <= (this.rings-1)) this.alpha=0.75
        // if (d <= (this.rings-this.transitionRings-1)) this.alpha=0.85
        // this.alpha = Math.abs(sector.x)/5 + Math.abs(sector.y)/10
    }
}
