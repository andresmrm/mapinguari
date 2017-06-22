import config from '../../config'
import t from '../../i18n/i18n'
import Menu from '../menu'


let directions = {
    ne: 'top left',
    e: 'left',
    se: 'bottom left',
    sw: 'bottom right',
    w: 'right',
    nw: 'top right',
}

export default class ChangeHotkeys extends Menu {
    constructor (manager) {
        super(manager)
        this.name = 'hotkeys'
        // callback used to change key
        this.changingKey = null
    }

    open () {
        this.addTitle('change hotkeys')

        let keys = config.keybinds
        Object.keys(keys.move).forEach((dir, i) => {
            let text = (i+1) + ' ' + t(directions[dir]) + ': '
            text += this.keyCodeToString(keys.move[dir]).toUpperCase()
            this.addButton(text, () => {
                this.changingKey = (keyCode) => {
                    console.log('CHANGE', keyCode, String.fromCharCode(keyCode))
                    keys.move[dir] = keyCode
                }
            })
        })

        let text = t('open map') + ': '
        text += this.keyCodeToString(keys.map).toUpperCase()
        this.addButton(text, () => {
            this.changingKey = (keyCode) => {
                keys.map = keyCode
            }
        })

        this.addText(' ')

        this.addButton('back', () => {
            this.manager.close()
        })
    }

    keypress (event) {
        if (this.changingKey) {
            this.changingKey(this.getKeyCode(event))
            this.changingKey = null
            config.save()
            this.reload()
        } else {
            this.handleKeypress(event)
        }
    }
}
