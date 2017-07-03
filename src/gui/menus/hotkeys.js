import {getKeyStr} from '../../utils'
import config from '../../config'
import t from '../../i18n/i18n'
import Menu from '../menu'


let directions = {
    ne: 'top right',
    e: 'right',
    se: 'bottom right',
    sw: 'bottom left',
    w: 'left',
    nw: 'top left',
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
            text += keyCodeToStr(keys.move[dir]).toUpperCase()
            this.addButton(text, () => {
                this.changingKey = (char) => {
                    keys.move[dir] = char
                }
            })
        })

        let text = t('open map') + ': '
        text += keyCodeToStr(keys.map).toUpperCase()
        this.addButton(text, () => {
            this.changingKey = (char) => {
                keys.map = char
            }
        })

        this.addText(' ')

        this.addButton('back', () => {
            this.manager.close()
        })
    }

    keypress (event) {
        if (this.changingKey) {
            // Converts key code to string to uppercase and convert
            // back to key code. This avoids problems with Phaser, that
            // uses uppercase codes.
            this.changingKey(
                getKeyStr(event).toUpperCase().charCodeAt(0)
            )
            this.changingKey = null
            config.save()
            this.reload()
        } else {
            this.handleKeypress(event)
        }
    }
}
