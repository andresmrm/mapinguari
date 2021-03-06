import Phaser from 'phaser-ce'

import config from '../config'
import {getNoise} from '../noiser'
import {cubeToAxial, axialToCube, cubeRound, forEachHexInDist, axialDistance} from './utils'


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
// function clicked(tile) {
//     console.log(tile.x, tile.y)
//     tile.map.zoomInTile(tile)
// }


export class Tile extends Phaser.Sprite {
    constructor (map, pixelCoords, mapCoords, group) {
        super(map.game, pixelCoords.x, pixelCoords.y, 'tiles')
        group.add(this)

        this.coords = mapCoords
        this.map = map
        this.map.setAnchor(this)

        if (config.tileOver) {
            this.inputEnabled = true
            // this.input.useHandCursor = true
            this.input.pixelPerfectOver = true
            this.events.onInputOver.add(over, this)
            this.events.onInputOut.add(out, this)
        }
    }
    appear(time) {
        this.alpha = 0
        this.map.game.add.tween(this).to({alpha:1}, time, Phaser.Easing.Linear.None, true)
    }
    disappear(time) {
        let tween = this.map.game.add.tween(this).to({alpha:0}, time, Phaser.Easing.Linear.None, true)
        tween.onComplete.add(() => this.destroy())
    }
}


export class FarTile extends Tile {
    constructor (map, mapCoords, group) {
        let pixelCoords = map.axialToPixelFlat(mapCoords),
            noiseCoords = map.toNearCoords(mapCoords),
            noise = getNoise(noiseCoords.x, noiseCoords.y)

        super(map, pixelCoords, mapCoords, group)

        this.noise = 0
        forEachHexInDist(
            map.toNearCoords(mapCoords),
            this.map.nearRings-1,
            (coords) => {this.noise += getNoise(coords.x, coords.y)}
        )
        this.noise = this.noise/this.map.numTilesPerSector

        this.updateFrame()

        // this.input.pixelPerfectClick = true
        // this.events.onInputUp.add(clicked, this)
    }

    updateFrame() {
        // TODO: florest level can be a float!!! round?
        let frame = Math.round(this.map.getFarFlorestLevel(this))
        frame = frame<4?frame:3
        this.frame = frame + 15
        // this.frame = this.map.getFarFlorestLevel(this) + 15
    }

    checkDevastated() {
        return this.frame == 15 ? true : false
    }
}


export class NearTile extends Tile {
    constructor (map, mapCoords, group/*, sector*/) {
        let pixelCoords = map.axialToPixelPointy(mapCoords),
            noiseCoords = mapCoords

        super(map, pixelCoords, mapCoords, group)

        // this.sector = sector
        // this.noise = getNoise(noiseCoords.x, noiseCoords.y)

        this.updateFrame()

        // let d = cubeDistance(axialToCube(coords), {x:0,y:0,z:0})
        // if (d <= (this.rings-1)) this.alpha=0.75
        // if (d <= (this.rings-this.transitionRings-1)) this.alpha=0.85
        // this.alpha = Math.abs(sector.x)/5 + Math.abs(sector.y)/10
    }

    updateFrame() {
        let frame = this.map.getNearFlorestLevel(this.coords)
        this.frame = frame<4?frame:3
        // this.frame = 0
        // if (this.noise > .1) this.frame = 2
        // if (this.noise > .6) this.frame = 1
        // if (this.noise > .8) this.frame = 0
        // let newValue = this.frame - this.map.microData.get(this.coords).devastation
        // if (newValue < 0) this.frame = 0
        // else this.frame = newValue
    }
}
