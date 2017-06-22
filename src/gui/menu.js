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

        if (!hotkey) hotkey = text[0]
        node.innerHTML = text.replace(
            hotkey, `<span class="hotkey-mark">${hotkey}</span>`)

        node.onclick = fn
        this.hotkeys[hotkey] = fn

        this.root.appendChild(node)
    }

    keypress (event) {
        var keynum;
        if(window.event) { // IE
            keynum = event.keyCode;
        } else if(event.which){ // Netscape/Firefox/Opera
            keynum = event.which;
        }

        let key = String.fromCharCode(keynum),
            fn = this.hotkeys[key]
        if (fn) fn()
    }

    close () {
        this.manager.close()
    }
}
