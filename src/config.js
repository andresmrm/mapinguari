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

let config = defaultConfig,
    storeName = defaultConfig.localStorageName

if (localStorage[storeName]) {
    // Loads previous saved configs
    let restoredConfig = JSON.parse(localStorage[storeName])
    if (restoredConfig.version == defaultConfig.version) {
        // restored config is valid, replace default config
        config = restoredConfig
    }
}

// Saves configs
config.save = function saveConfig() {
    localStorage[storeName] = JSON.stringify(config)
}

export default config
