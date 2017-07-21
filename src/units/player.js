import Phaser from 'phaser-ce'
import Unit from './unit'
import config from '../config'


export default class Player extends Unit {
    constructor (map, coords) {
        super(map, coords, 31)
        this.actionThrottleTime = 250
        this.lastPointerCoords = null
    }

    move(direction) {
        if(super.move(direction)) {
            this.map.changeSector(this.coords)
            if (config.centerPlayer) {
                this.map.centerViewport(this.coords)
            }
        }
    }

    triedToLeaveWorld() {
        // Avoids being destroyed.
    }

    update() {
        // Saving last clicked coords we avoid losing clicks due
        // to action throttle.
        if (this.game.input.activePointer.isDown) {
            this.saveMouseCoords()
        }

        super.update()
    }

    saveMouseCoords() {
        this.lastPointerCoords = this.map.pixelToAxialPointy(
            {x:this.game.input.x, y:this.game.input.y})
    }

    live() {
        if (!this.map.gameEnded) {

            // Check move keys and move
            let moveKeys = config.keybinds.move,
                moved = false
            Object.keys(moveKeys).forEach(
                (dir) => {
                    if (!moved && this.game.input.keyboard.isDown(moveKeys[dir])) {
                        this.move(dir)
                        moved = true
                    }
                }
            )

            if (config.followMouse) {
                this.saveMouseCoords()
            }

            // Check pointer (mouse or touch) and move
            if (this.lastPointerCoords) {
                this.moveTo(this.lastPointerCoords)
                // If arrived destination, stop moving
                if (this.lastPointerCoords.equal(this.coords))
                    this.lastPointerCoords = null
            }

        }
    }
}
