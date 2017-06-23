import {randTrue} from '../noiser'
import {getRandomDirection, axialDistance} from '../map/utils'

export default class Unit {
    constructor(map, coords, tile) {
        this.map = map
        this.game = map.game
        this.coords = coords
        this.tile = tile
        this.fleeingFrame = this.tile
        this.sprite = this.map.addUnit(this)
        this.sprite.update = () => this.update()
        this.sprite.unit = this
        this.updateSpriteCoords()
        this.last_action = 0
        this.initialFear = 6
        this.fear = this.initialFear
        this.actionThrottleTime = 150
        this.checkUnitInViewport()
    }

    updateSpriteCoords() {
        let screenCoords = this.map.axialToPixelPointy(this.coords)
        this.sprite.x = screenCoords.x
        this.sprite.y = screenCoords.y
    }

    move(direction) {
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

    // Move towards a coords
    moveTo(coords) {
        let dx = coords.x - this.coords.x,
            dy = coords.y - this.coords.y
        if (dx!=0 || dy!=0) return this.move({x: Math.sign(dx), y: Math.sign(dy)})
        return false
    }

    // Called when the unit tried to leave the world
    triedToLeaveWorld() {
        console.log('Out!')
        this.destroy()
    }

    destroy() {
        this.sprite.destroy()
    }

    checkUnitInViewport() {
        this.sprite.visible = this.map.checkCoordsInViewport(this.coords)
    }

    // Returns true if acted more than actionThrottleTime ago,
    // false otherwise.
    throttleAction(direction) {
        let now = this.game.time.now
        if(now - this.last_action > this.actionThrottleTime) {
            this.last_action = now
            return true
        } else {
            return false
        }
    }

    update() {
        if (this.throttleAction()) this.live()
    }

    live() {
        if(!this.flee()) {
            this.notFleeing()
        }
    }

    // What to do when not fleeing
    notFleeing() {
        this.wanderer()
    }

    wanderer() {
        if (randTrue(0.2)) this.move(getRandomDirection())
    }

    // Flee from player
    // Return true if is fleeing, false otherwise
    flee() {
        var playerCoords = this.map.player.coords
        if (axialDistance(playerCoords, this.coords) < this.fear/2) {
            this.sprite.frame = this.fleeingFrame
            if (randTrue(0.5)) this.fear += 1
            let dx = this.coords.x - playerCoords.x,
                dy = this.coords.y - playerCoords.y
            this.move({x: Math.sign(dx), y: Math.sign(dy)})
            return true
        } else {
            this.sprite.frame = this.tile
            if (randTrue(0.99) && this.fear > this.initialFear) this.fear--
            return false
        }
    }
}
