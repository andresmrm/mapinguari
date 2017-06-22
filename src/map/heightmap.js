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
        this.sprite = this.map.game.add.sprite(0, 0, this.bitmap)
        this.sprite.alpha = 0.3
        this.sprite.z = 10
    }

    hide() {
        this.sprite.kill()
    }

    show() {
        this.sprite.revive()
    }

    toggle() {
        if (this.sprite.alive) this.hide()
        else this.show()
    }

    destroy() {
        this.bitmap.destroy()
        this.sprite.destroy()
        delete this
    }
}
