import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/boot'
import SplashState from './states/splash'
import WaitStartState from './states/waitstart'
import GameState from './states/game'

import config from './config'
import gui from './gui/gui'
import {startNoiseGen} from './noiser'


class Game extends Phaser.Game {
    constructor () {
        const docElement = document.documentElement
        const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
        const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

        super(width, height, Phaser.AUTO, 'content', null, false, false)

        this.gui = gui
        this.gui.game = this

        this.state.add('Boot', BootState, false)
        this.state.add('Splash', SplashState, false)
        this.state.add('WaitStart', WaitStartState, false)
        this.state.add('Game', GameState, false)

        this.state.start('Boot')
    }

    restart () {
        startNoiseGen()
        this.state.restart('Game')
    }
}

window.game = new Game()
