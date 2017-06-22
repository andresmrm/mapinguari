import config from '../../config'
import t from '../../i18n/i18n'
import Menu from '../menu'


export default class Instructions extends Menu {
    constructor (manager) {
        super(manager)
        this.name = 'instructions'
    }

    open () {
        this.addTitle('instructions')
        this.addText('-instructions')
        this.addText('-movekeys')
        let keys = config.keybinds,
            text = ''
        Object.keys(keys.move).forEach((dir) => {
            text += String.fromCharCode(keys.move[dir]) + ' '
        })
        this.addText(text)
        this.addText('-mapkey')
        this.addText(String.fromCharCode(keys.map))

        this.addButton('back', () => {
            this.manager.close()
        })
    }
}
