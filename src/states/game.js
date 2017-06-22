/* globals __DEV__ */
import Phaser from 'phaser-ce'
import config from '../config'
import {Map} from '../map/map'
import {axialToCube, axialDistance} from '../map/utils'

export default class Game extends Phaser.State {
    init () {}
    preload () {}

    create () {
        this.stage.backgroundColor = '#111'
        this.input.useHandCursor = true
        this.time.advancedTiming = true
        this.stage.disableVisibilityChange = false

        this.cursors = this.input.keyboard.createCursorKeys()

        this.input.keyboard.onUpCallback = (e) => {
            if(this.map) {
                if(e.keyCode == config.keybinds.map) this.map.toggleFarMap()
                if(e.keyCode == Phaser.Keyboard.H) this.map.toggleHeighmap()
                if(e.keyCode == Phaser.Keyboard.G) this.toggleDebugInfo()
                if(e.keyCode == Phaser.Keyboard.ESC) this.toggleMenu()
            }
        }

        this.startMap()

        let resize = () => {
            this.game.scale.setGameSize(window.innerWidth, window.innerHeight)
            let scaleH = window.innerHeight / this.map.mapTopOffset/2,
                scaleW = window.innerWidth / this.map.mapLeftOffset/2,
                scale = Math.min(scaleH, scaleW)
            this.game.world.scale.setTo(scale, scale)
            this.map.centerMapOnScreen(
                window.innerHeight/scale, window.innerWidth/scale)
        }

        // Resizes game on window resize
        // based on: http://www.html5gamedevs.com/topic/13900-doubt-about-making-my-game-responsive-on-onresize/
        // The delay is supposed to help on some devices
        window.addEventListener(
            'resize', () => this.game.time.events.add(200, resize), false)

        resize()
    }

    startMap () {
        this.map = new Map(this)
        this.map.generate()
    }

    toggleDebugInfo() {
        this.showDebugInfo = !this.showDebugInfo
    }

    toggleMenu () {
        this.game.gui.add(['gamemenu'])
        this.game.paused = true
    }

    render () {
        // var style = {font: "16px fixed", fill: "#eeeeee"};
        // this.game.add.text(0,0,"My Custom Fção Works", style);
        if (this.showDebugInfo) {
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

            if (this.map.player.coords) {
                text = 'Player: ' + this.map.player.coords.x + ',' + this.map.player.coords.y
                this.game.debug.text(text, 2, h, "#ffffff")
                h += 20

                let roundedPos = this.map.toSectorCoords(this.map.player.coords)
                text = 'Player Sector: ' + roundedPos.x + ',' + roundedPos.y
                this.game.debug.text(text, 2, h, "#ffffff")
                h += 20

                let cubic = axialToCube(this.map.player.coords)
                text = 'Player Cubic: ' + cubic.x + ',' + cubic.y + ',' + cubic.z
                this.game.debug.text(text, 2, h, "#ffffff")
                h += 20

                let originDist = axialDistance(this.map.player.coords, {x:0,y:0})
                text = 'OrigDist: ' + originDist
                this.game.debug.text(text, 2, h, "#ffffff")
                h += 20
            }
        }
    }

    update () {
        // let speed = 5

        // if (this.cursors.left.isDown) {
        //     this.game.camera.x = this.game.camera.x - speed
        // } else if (this.cursors.right.isDown) {
        //     this.game.camera.x = this.game.camera.x + speed
        // }

        // if (this.cursors.up.isDown) {
        //     this.game.camera.y = this.game.camera.y - speed
        // } else if (this.cursors.down.isDown) {
        //     this.game.camera.y = this.game.camera.y + speed
        // }

        this.map.update(this.input)
    }

    shutdown () {
        this.map.destroy()
    }
}
