import Phaser from 'phaser-ce'


export default class WaitStart extends Phaser.State {
    update () {
        if (this.game.readyToStart) this.state.start('Play')
    }
}
