import {getNoise} from '../noiser'


export default class Heightmap {
    constructor (map) {
        this.map = map
        this.createHeightmap()
    }

    createHeightmap() {
        let heightmapWidth = (this.map.columns+1)*this.map.tileWidth,
            heightmapHeight = (this.map.rows+1)*this.map.tilePointyHeightVariationPerRow

        this.bitmap = this.map.game.make.bitmapData(heightmapWidth, heightmapHeight)
        for (var x = 0; x < heightmapWidth; x++) {
            for (var y = 0; y < heightmapHeight; y++) {
                let noise = getNoise(x-this.map.mapLeftOffset, y-this.map.mapTopOffset)
                let color = 'green'
                if (noise > .3) color = 'rgb(0,100,0)'
                if (noise > .6) color = 'rgb(0,50,0)'
                if (noise > .8) color = 'rgb(50,50,50)'
                if (noise > .9) color = 'white'
                this.bitmap.rect(x, y, 1, 1, color)
            }
        }
        this.heightmapSprite = this.map.game.add.sprite(0, 0, this.bitmap)
        this.heightmapSprite.alpha = 0.3
        this.heightmapSprite.z = 10
    }

    hide() {
        this.heightmapSprite.kill()
    }

    show() {
        this.heightmapSprite.revive()
    }

    toggle() {
        if (this.heightmapSprite.alive) this.hide()
        else this.show()
    }
}
