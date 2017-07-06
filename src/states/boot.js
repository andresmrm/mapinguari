import Phaser from 'phaser-ce'
import config from '../config'


export default class Boot extends Phaser.State {
    init () {
        this.stage.backgroundColor = '#111'
    }

    preload () {
        let text = this.add.text(
            this.world.centerX, this.world.centerY, 'loading...',
            { font: '16px fixed', fill: '#dddddd', align: 'center' })
        text.anchor.setTo(0.5, 0.5)

        this.load.image('loaderBg', './assets/images/loader-bg.png')
        this.load.image('loaderBar', './assets/images/loader-bar.png')

        let menus = ['history1']
        if (!config.language) menus.unshift('langPicker')
        this.game.gui.add(menus)
    }

    render () {
        this.state.start('Splash')
    }
}
