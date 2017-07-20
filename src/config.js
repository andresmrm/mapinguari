import Phaser from 'phaser-ce'

let defaultConfig = {
    localStorageName: 'mapinguari',
    language: null,
    defaultLang: 'en',
    centerPlayer: true,
    centerView: true,
    tileOver: false,
    followMouse: false,
    keybinds: {
        move: {
            ne: Phaser.Keyboard.E,
            e: Phaser.Keyboard.D,
            se: Phaser.Keyboard.C,
            sw: Phaser.Keyboard.Z,
            w: Phaser.Keyboard.A,
            nw: Phaser.Keyboard.Q,
        },
        map: Phaser.Keyboard.M,
    },
    maxDevastation: 50,
}

let config = null,
    storeName = defaultConfig.localStorageName

if (localStorage[storeName]) {
    // Loads previous saved configs
    config = JSON.parse(localStorage[storeName])
} else {
    // No save configs found, use default config
    config = defaultConfig
}

// Saves configs
config.save = function saveConfig() {
    localStorage[storeName] = JSON.stringify(config)
}

export default config
