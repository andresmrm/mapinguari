import Phaser from 'phaser-ce'

export default {
    localStorageName: 'mapinguari',
    language: 'en',
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
