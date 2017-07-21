import Phaser from 'phaser-ce'

let defaultConfig = {
    localStorageName: 'mapinguari',
    language: null,
    defaultLang: 'en',
    centerPlayer: true,
    centerView: true,
    tileOver: false,
    followMouse: false,
    trackingEnabled: true,
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
    version: 1.1,
}

let config = null,
    storeName = defaultConfig.localStorageName

if (localStorage[storeName]
    && localStorage[storeName].version == defaultConfig.version) {
    // Loads previous saved configs
    config = JSON.parse(localStorage[storeName])
} else {
    // No saved configs found or version mismatch, use default config
    config = defaultConfig
}

// Saves configs
config.save = function saveConfig() {
    localStorage[storeName] = JSON.stringify(config)
}

export default config
