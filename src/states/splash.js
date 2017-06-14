import Phaser from 'phaser-ce'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
    init () {}

    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
        centerGameObjects([this.loaderBg, this.loaderBar])

        this.load.setPreloadSprite(this.loaderBar)
        //
        // load your assets
        //
        this.load.spritesheet('tiles', 'assets/images/tiles.png', 32, 48)
        // this.load.spritesheet('tiles', 'assets/images/hextiles2.png', 32, 48)
        // this.load.spritesheet('tiles', 'assets/images/hexmini.png', 18, 18)
        this.load.image('mushroom', 'assets/images/mushroom2.png')

        // this.load.tilemap('mario', 'assets/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
        // this.load.image('tiles', 'assets/super_mario.png');

        // this.load.tilemap('hex', 'assets/hexagonal-mini.json', null, Phaser.Tilemap.TILED_JSON);
        // this.load.image('tileshex', 'assets/hexmini.png');
    }

    create () {
        this.state.start('Game')
    }
}
