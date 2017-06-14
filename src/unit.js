export class Player {
    constructor (map, coords) {
        this.map = map
        this.game = map.game

        this.mapCoords = coords

        // this.sprite = this.game.add.sprite(0, 0, 'tiles', 0)
        // this.tileSpriteHeight = 48
        // this.tileCenterHeight = 31 // from top to the center
        // this.sprite.anchor.y = this.tileCenterHeight / this.tileSpriteHeight
        this.sprite = this.game.add.sprite(0, 0, 'mushroom')
        this.map.addUnit(this)
        // game.world.bringToTop
        this.sprite.scale.setTo(0.3, 0.3)
        this.sprite.anchor.x = 0.5
        this.sprite.anchor.y = 0.5
        this.sprite.z = 2

        this.updateSpriteCoords()

        this.sprite.tint = 0xff0000
        this.last_moved = 0
    }

    updateSpriteCoords () {
        let screenCoords = this.map.mapToScreenCoords(this.mapCoords)
        this.sprite.x = screenCoords.x
        this.sprite.y = screenCoords.y
    }

    move (direction) {
        if(this.game.time.now - this.last_moved > 100) {
            this.last_moved = this.game.time.now
            this.mapCoords = this.map.translate(this.mapCoords, direction)
            console.log(this.mapCoords)
            this.updateSpriteCoords()
        }
    }
}
