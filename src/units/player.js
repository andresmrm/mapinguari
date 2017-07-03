import Phaser from 'phaser-ce'
import Unit from './unit'
import config from '../config'


export default class Player extends Unit {
    constructor (map, coords) {
        super(map, coords, 31)
        this.actionThrottleTime = 250
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

            // Check pointer (mouse or touch) and move
            if (config.followMouse || this.game.input.activePointer.isDown) {
                let screenCoords = {x: this.game.input.x, y: this.game.input.y}
                let mapCoords = this.map.pixelToAxialPointy(screenCoords)
                this.moveTo(mapCoords)
            }

        }
    }
}
