import Phaser from 'phaser-ce'
import Unit from './unit'
import config from '../config'


export default class Player extends Unit {
    constructor (map, coords) {
        super(map, coords, 31)
        this.actionThrottleTime = 150
    }

    playerMove(direction) {
        // if(this.throttleMove(direction, this.moveThrottleTime)) {
        if(this.move(direction)) {
            this.map.changeSector(this.coords)
            if (config.centerPlayer) this.map.centerViewport(this.coords)
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
                    // console.log(moveKeys[dir], this.game.input.keyboard.isDown(moveKeys[dir]))
                    if (!moved && this.game.input.keyboard.isDown(moveKeys[dir])) {
                        this.playerMove(dir)
                        moved = true
                    }
                }
            )
        }
    }
}
