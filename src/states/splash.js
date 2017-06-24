import Phaser from 'phaser-ce'
import { centerGameObjects } from '../utils'

export default class Splash extends Phaser.State {
    init () {}

    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
        centerGameObjects([this.loaderBg, this.loaderBar])

        this.load.setPreloadSprite(this.loaderBar)

        this.load.spritesheet('tiles', 'assets/images/tiles.png', 32, 48)
        this.load.audioSprite('audios', 'assets/audios/sprite.ogg',
                              'assets/audios/sprite.json')
    }

    create () {
        this.game.initAudio()
        this.state.start('WaitStart')
    }
}
