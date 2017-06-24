import {keyCodeToStr} from '../utils'
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

    getKeyCode (event) {
        if(window.event) { // IE
            return event.keyCode;
        } else if(event.which){ // Netscape/Firefox/Opera
            return event.which
        } else {
            throw 'no method to decode key code'
        }
    }

    handleKeypress (event) {
        var keynum = this.getKeyCode(event),
            key = keyCodeToStr(keynum),
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
