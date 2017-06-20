import Phaser from 'phaser-ce'
import Unit from './unit'


export default class Player extends Unit {
    constructor (map, coords) {
        super(map, coords, 31)
        this.actionThrottleTime = 150
    }

    playerMove(direction) {
        // if(this.throttleMove(direction, this.moveThrottleTime)) {
        if(this.move(direction)) {
            this.map.changeSector(this.coords)
            // if (config.centerPlayer) this.map.centerViewport(this.coords)
        }
    }

    triedToLeaveWorld() {
    }

    live() {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.playerMove('nw')
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.T)) {
            this.playerMove('ne')
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.playerMove('w')
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            this.playerMove('e')
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.V)) {
            this.playerMove('sw')
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.G)) {
            this.playerMove('se')
        }
    }
}
