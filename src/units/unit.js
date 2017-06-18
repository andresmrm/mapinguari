import {random} from '../noiser'
import {getRandomDirection, translate} from '../map/utils'

export default class Unit {
    constructor(map, coords, tile) {
        this.map = map
        this.game = map.game
        this.coords = coords
        this.tile = tile
        this.sprite = this.map.addUnit(this)
        this.sprite.update = () => this.update()
        this.updateSpriteCoords()
        this.last_moved = 0
    }

    updateSpriteCoords() {
        let screenCoords = this.map.axialToPixelPointy(this.coords)
        this.sprite.x = screenCoords.x
        this.sprite.y = screenCoords.y
    }

    move(direction) {
        this.last_moved = this.game.time.now
        this.coords = translate(this.coords, direction)
        this.updateSpriteCoords()
    }

    // Only allow move if last move was more than time ago.
    // Returns true if moved, false otherwise.
    throttleMove(direction, time) {
        if(this.game.time.now - this.last_moved > time) {
            this.move(direction)
            return true
        } else {
            return false
        }
    }

    update() {
    }

    wanderer() {
        if (random() > 0.99) this.throttleMove(getRandomDirection(), 2000)
    }

    flee() {
    }
}
