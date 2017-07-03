import Phaser from 'phaser-ce'
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
        this.initialFear = 4
        this.fear = this.initialFear
        this.actionThrottleTime = 150
        this.isFleeing = false
        this.checkUnitInViewport()
    }

    updateSpriteCoords() {
        let screenCoords = this.map.axialToPixelPointy(this.coords)

        this.game.add.tween(this.sprite).to(
            { x: screenCoords.x, y: screenCoords.y },
            this.actionThrottleTime, Phaser.Easing.Linear.None, true)
        // this.sprite.x = screenCoords.x
        // this.sprite.y = screenCoords.y
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

    // Play sound, reduce volume with distance
    playSound(name) {
        let volume = 1 / (axialDistance(this.coords, this.map.player.coords)*0.8)**(0.7)
        if (volume > 0.1) this.map.game.playSound(name, volume)
    }

    // Move towards a coords
    moveTo(coords) {
        // TODO: use A*?

        let dx = Math.sign(coords.x - this.coords.x),
            dy = Math.sign(coords.y - this.coords.y)

        // Avoid coords -1,-1 or 1,1
        if (Math.abs(dx + dy) > 1) dx = 0

        // TODO: can try to move outside of map!!!!
        if (dx!=0 || dy!=0) return this.move({x: dx, y: dy})
        return false
    }

    // Called when the unit tried to leave the world
    triedToLeaveWorld() {
        if (this.isFleeing) {
            this.playSound('out')
            this.destroy()
        }
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
        if (axialDistance(playerCoords, this.coords) < this.fear) {
            if (!this.isFleeing) this.playSound(this.fleeSound)
            this.isFleeing = true
            this.sprite.frame = this.fleeingFrame
            if (randTrue(0.5)) {
                this.fear += 1
                this.freakOutCheck()
            }
            let dx = this.coords.x - playerCoords.x,
                dy = this.coords.y - playerCoords.y
            this.move({x: Math.sign(dx), y: Math.sign(dy)})
            return true
        } else {
            this.isFleeing = false
            this.sprite.frame = this.tile
            if (randTrue(0.5) && this.fear > this.initialFear) this.fear--
            return false
        }
    }

    freakOutCheck() {
    }
}
