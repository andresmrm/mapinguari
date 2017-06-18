/* globals __DEV__ */
import Phaser from 'phaser-ce'
import {Map} from '../map/map'

export default class extends Phaser.State {
    init () {}
    preload () {}

    create () {
        this.stage.backgroundColor = '#111'
        // this.game.world.scale.setTo(3, 3)
        // this.game.world.scale.setTo(2, 2)
        this.input.useHandCursor = true
        this.time.advancedTiming = true
        this.stage.disableVisibilityChange = false

        this.map = new Map(this)
        this.map.generate()
        var map = this.map

        this.cursors = this.input.keyboard.createCursorKeys()

        this.input.keyboard.onUpCallback = function(e) {
            if(e.keyCode == Phaser.Keyboard.M){
                map.toggleFarMap()
            }

            if(e.keyCode == Phaser.Keyboard.H){
                map.toggleHeighmap()
            }
        }
    }

    render () {
        let h = 20
        this.game.debug.text(this.game.time.fps, 2, h, "#ffffff");
        h += 20
        let text = ''
        if (window.overCoords) {
            text = 'Over: ' + window.overCoords.x + ',' + window.overCoords.y
            this.game.debug.text(text, 2, h, "#ffffff")
            h += 20
        }

        if (window.overSector) {
            text = 'Sector: ' + window.overSector.x + ',' + window.overSector.y
            this.game.debug.text(text, 2, h, "#ffffff")
            h += 20
        }
        if (window.overSector) {
            text = 'Sector Rounded: ' + Math.round(window.overSector.x) + ',' + Math.round(window.overSector.y)
            this.game.debug.text(text, 2, h, "#ffffff")
            h += 20
        }
        if (window.overSectorCubeRound) {
            text = 'Sector Rounded: ' + window.overSectorCubeRound.x + ',' + window.overSectorCubeRound.y
            this.game.debug.text(text, 2, h, "#ffffff")
            h += 20
        }

        if (this.map.zoomedCoordsFar) {
            text = 'Zoomed Far: ' + this.map.zoomedCoordsFar.x + ',' + this.map.zoomedCoordsFar.y
            this.game.debug.text(text, 2, h, "#ffffff")
            h += 20
        }
        if (this.map.zoomedCoordsNear) {
            text = 'Zoomed Near: ' + this.map.zoomedCoordsNear.x + ',' + this.map.zoomedCoordsNear.y
            this.game.debug.text(text, 2, h, "#ffffff")
            h += 20
        }

        if (this.map.playerPos) {
            text = 'Player: ' + this.map.playerPos.x + ',' + this.map.playerPos.y
            this.game.debug.text(text, 2, h, "#ffffff")
            h += 20
            let roundedPos = this.map.toSector(this.map.playerPos)
            text = 'Player Sector: ' + roundedPos.x + ',' + roundedPos.y
            this.game.debug.text(text, 2, h, "#ffffff")
            h += 20
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

        this.map.update(this.input)
    }
}
