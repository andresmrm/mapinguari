/* globals __DEV__ */
import Phaser from 'phaser-ce'
import {Map} from '../map'
import {Player} from '../unit'

export default class extends Phaser.State {
    init () {}
    preload () {}

    create () {
        this.stage.backgroundColor = '#111'
        this.game.world.scale.setTo(3, 3)
        this.input.useHandCursor = true
        this.time.advancedTiming = true;
        this.stage.disableVisibilityChange = false

        this.map = new Map(this)
        this.map.generate()

        this.player = new Player(this.map, {x:0, y:0})

        this.cursors = this.input.keyboard.createCursorKeys();

        this.map.zoomInXY(0, 0)
    }

    render () {
        this.game.debug.text(this.game.time.fps, 2, 20, "#ffffff");
        if (window.overCoords)
            this.game.debug.text('Over: ' + window.overCoords.x + ',' + window.overCoords.y, 2, 40, "#ffffff");
        if (this.map.zoomedCoords)
            this.game.debug.text('Zoomed: ' + this.map.zoomedCoords.x + ',' + this.map.zoomedCoords.y, 2, 60, "#ffffff");
        if (__DEV__) {
            // this.game.debug.spriteInfo(this.mushroom, 32, 32)
        }
    }

    update () {
        let speed = 5

        if (this.cursors.left.isDown) {
            this.game.camera.x = this.game.camera.x - speed
        } else if (this.cursors.right.isDown) {
            this.game.camera.x = this.game.camera.x + speed
        }

        if (this.cursors.up.isDown) {
            this.game.camera.y = this.game.camera.y - speed
        } else if (this.cursors.down.isDown) {
            this.game.camera.y = this.game.camera.y + speed
        }

        if (this.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
            this.map.zoomOut()
        }

        if (this.input.keyboard.isDown(Phaser.Keyboard.H)) {
            this.map.toggleHeighmap()
        }

        if (this.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.player.move('nw')
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.T)) {
            this.player.move('ne')
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.player.move('w')
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.S)) {
            this.player.move('e')
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.V)) {
            this.player.move('sw')
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.G)) {
            this.player.move('se')
        }
    }
}
