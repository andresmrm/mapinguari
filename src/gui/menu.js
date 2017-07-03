import {getKeyStr} from '../utils'
import t from '../i18n/i18n'

export default class Menu {
    constructor (manager) {
        this.manager = manager
        this.root = this.manager.root
        this.hotkeys = {}
    }

    addTitle(textName) {
        let node = document.createElement('h1'),
            text = t(textName)
        node.innerHTML = text
        this.root.appendChild(node)
    }

    addText(textName) {
        let node = document.createElement('p'),
            text = t(textName)
        node.innerHTML = text
        this.root.appendChild(node)
    }

    addButton(textName, fn, hotkey=null) {
        let node = document.createElement('a'),
            text = t(textName)

        node.classList.add('button')

        if (!hotkey) hotkey = text[0]
        node.innerHTML = text.replace(
            hotkey, `<span class="hotkey-mark">${hotkey}</span>`)

        let buttomFn = () => {
            this.manager.playClick()
            fn()
        }
        node.onclick = buttomFn
        this.hotkeys[hotkey] = buttomFn

        this.root.appendChild(node)
    }

    keypress (event) {
        this.handleKeypress(event)
    }

    handleKeypress (event) {
        var key = getKeyStr(event),
            fn = this.hotkeys[key]
        if (fn) fn()
    }

    close () {
        this.manager.close()
    }

    reload () {
        this.manager.replace([this.name])
    }
}
