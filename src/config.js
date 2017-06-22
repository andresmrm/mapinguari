import Phaser from 'phaser-ce'

let defaultConfig = {
    localStorageName: 'mapinguari',
    language: null,
    defaultLang: 'en',
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

let config = null,
    storeName = defaultConfig.localStorageName

// Saves configs
function saveConfig() {
    localStorage[storeName] = JSON.stringify(config)
}

if (localStorage[storeName]) {
    // Loads previous saved configs
    config = JSON.parse(localStorage[storeName])
} else {
    // No save configs found, use default config
    config = defaultConfig
}
config.save = saveConfig

export default config
