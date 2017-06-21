import Phaser from 'phaser-ce'

export default {
    // gameWidth: 810,
    // gameHeight: 600,
    // gameWidth: 1420,
    // gameHeight: 1000,
    localStorageName: 'mapinguari',
    keybinds: {
        // move: {
        //     ne: Phaser.Keyboard.E,
        //     e: Phaser.Keyboard.D,
        //     se: Phaser.Keyboard.C,
        //     sw: Phaser.Keyboard.Z,
        //     w: Phaser.Keyboard.A,
        //     nw: Phaser.Keyboard.Q,
        // },
        move: {
            ne: Phaser.Keyboard.C,
            e: Phaser.Keyboard.R,
            se: Phaser.Keyboard.F,
            sw: Phaser.Keyboard.V,
            w: Phaser.Keyboard.D,
            nw: Phaser.Keyboard.W,
        },
        map: Phaser.Keyboard.M,
    }
}
