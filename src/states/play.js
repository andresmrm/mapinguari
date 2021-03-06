/* globals __DEV__ */
import Phaser from 'phaser-ce'
import config from '../config'
import {Map} from '../map/map'
import {axialToCube, axialDistance} from '../map/utils'
import {track} from '../utils'

export default class Play extends Phaser.State {
    init () {}
    preload () {}

    create () {
        this.stage.backgroundColor = '#111'
        this.input.useHandCursor = true
        this.time.advancedTiming = true
        this.stage.disableVisibilityChange = false

        this.cursors = this.input.keyboard.createCursorKeys()

        this.input.keyboard.onUpCallback = (e) => {
            if(this.map && !this.game.paused) {
                if(e.keyCode == config.keybinds.map) this.map.toggleFarMap()
                if(e.keyCode == Phaser.Keyboard.H) this.map.toggleHeighmap()
                if(e.keyCode == Phaser.Keyboard.DELETE) this.toggleDebugInfo()
                if(e.keyCode == Phaser.Keyboard.HOME) this.toggleCenterPlayer()
                if(e.keyCode == Phaser.Keyboard.END) this.toggleCenterView()
                if(e.keyCode == Phaser.Keyboard.ESC) this.toggleMenu()
                if(e.keyCode == Phaser.Keyboard.SPACEBAR) this.toggleFollowMouse()
            }
        }

        this.bMenu = document.querySelector('#button-menu')
        this.bMenu.onclick = () => {
            this.toggleMenu()
        }
        this.bMap = document.querySelector('#button-map')
        this.bMap.onclick = () => {
            track('game-click', 'toggle-map')
            this.map.toggleFarMap()
        }
        this.showButtons()

        this.startMap()

        let resize = () => {
            this.game.scale.setGameSize(window.innerWidth, window.innerHeight)
            let scaleH = window.innerHeight / this.map.mapTopOffset/2,
                scaleW = window.innerWidth / this.map.mapLeftOffset/2,
                scale = Math.round(Math.min(scaleH, scaleW))
            if (scale == 0) scale = 1
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

        this.playSound('rrr')
        this.game.audio.get('forest').onDecoded.add(
            this.startAmbientSound, this)
        this.startAmbientSound()
    }

    showButtons() {
        if (this.bMap) this.bMap.style.display = 'flex'
        if (this.bMenu) this.bMenu.style.display = 'flex'
        if (this.map && this.map.textGui) this.map.textGui.style.display = 'block'
    }

    startAmbientSound() {
        this.forestSound = this.playSound('forest', 0, true)
        this.forestSound.fadeTo(2000, 1)
        this.windSound = this.playSound('wind', 0.001, true)
    }

    playSound(name, volume, loop) {
        return this.game.audio.play(name, volume, loop)
    }

    adjustAmbientSound(forestLevel) {
        if (this.forestSound) this.forestSound.fadeTo(2000, forestLevel+0.001)
        if (this.windSound) this.windSound.fadeTo(2000, 1-forestLevel+0.001)

    }

    startMap () {
        this.map = new Map(this)
        this.map.generate()
    }

    toggleDebugInfo() {
        this.showDebugInfo = !this.showDebugInfo
    }

    toggleCenterPlayer() {
        config.centerPlayer = !config.centerPlayer
        config.save()
    }

    toggleCenterView() {
        config.centerView = !config.centerView
        config.save()
    }

    toggleFollowMouse() {
        config.followMouse = !config.followMouse
        config.save()
    }

    toggleMenu () {
        if (!this.game.paused) {
            this.game.gui.add(['gamemenu'])
            this.game.paused = true
            this.bMenu.style.display = 'none'
            this.bMap.style.display = 'none'
            this.map.textGui.style.display = 'none'
        } else {
            this.showButtons()
        }
    }

    render () {
        if (this.showDebugInfo) {
            let h = 200
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
        this.map.update(this.input)
    }

    shutdown () {
        this.map.destroy()
    }

    defeat() {
        this.forestSound.fadeTo(2000, 0)
        this.windSound.fadeTo(2000, 1)
        if (this.map.month > 2) {
            track('game', 'defeat-impossible:'+this.map.month)
            this.game.gui.add(['defeatimpossible'])
        } else {
            track('game', 'defeat:'+this.map.month)
            this.game.gui.add(['defeat'])
        }
    }

    win() {
        track('game', 'win:'+this.map.month)
        this.game.gui.add(['win'])
    }

    nextMonth() {
        track('game', 'next-month:'+this.map.month)
        this.map.nextMonth()
    }
}
