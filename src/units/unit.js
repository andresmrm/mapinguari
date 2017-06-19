import {randTrue} from '../noiser'
import {getRandomDirection, axialDistance} from '../map/utils'

export default class Unit {
    constructor(map, coords, tile) {
        this.map = map
        this.game = map.game
        this.coords = coords
        this.tile = tile
        this.sprite = this.map.addUnit(this)
        this.sprite.update = () => this.update()
        this.sprite.unit = this
        this.updateSpriteCoords()
        this.last_moved = 0
        this.initialFear = 6
        this.fear = this.initialFear
    }

    updateSpriteCoords() {
        let screenCoords = this.map.axialToPixelPointy(this.coords)
        this.sprite.x = screenCoords.x
        this.sprite.y = screenCoords.y
    }

    move(direction) {
        this.last_moved = this.game.time.now
        try {
            this.coords = this.map.moveUnit(this.coords, direction)
            this.updateSpriteCoords()
            this.checkUnitInViewport()
        } catch(error) {
            if (error=='outOfWorld') this.triedToLeaveWorld()
            return false
        }
        return true
    }

    // Called when the unit tried to leave the world
    triedToLeaveWorld() {
        this.destroy()
    }

    destroy() {
        this.sprite.destroy()
    }

    checkUnitInViewport() {
        this.sprite.visible = this.map.checkCoordsInViewport(this.coords)
    }

    // Only allow move if last move was more than time ago.
    // Returns true if moved, false otherwise.
    throttleMove(direction, time) {
        if(this.game.time.now - this.last_moved > time) {
            return this.move(direction)
        } else {
            return false
        }
    }

    update() {
    }

    wanderer() {
        if (randTrue(0.99)) this.throttleMove(getRandomDirection(), 2000)
    }

    flee() {
        var playerCoords = this.map.player.coords
        if (axialDistance(playerCoords, this.coords) < this.fear/2) {
            if (randTrue(0.5)) this.fear += 1
            let dx = this.coords.x - playerCoords.x,
                dy = this.coords.y - playerCoords.y
            this.throttleMove({x: Math.sign(dx), y: Math.sign(dy)},
                              this.map.player.moveThrottleTime/2)
        } else {
            if (randTrue(0.99) && this.fear > this.initialFear) this.fear--
        }
    }
}
