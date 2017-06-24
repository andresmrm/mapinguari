import * as Menus from './menus';


class Gui {
    constructor () {
        this.root = document.querySelector('#gui-content')
        this.menusPile = []
        this.menus = {}
        Object.keys(Menus).forEach((menuCls) => {
            let menu = new Menus[menuCls](this)
            this.menus[menu.name] = menu
        })

        document.onkeypress = this.keypress.bind(this)
    }

    // Add menus to the menusPile. Open the first menu on the list.
    add (names) {
        for (let name of names.reverse()) {
            let menu = this.menus[name]
            if (!menu) throw 'menu not found!'
            this.menusPile.unshift(menu)
        }
        if (this.menusPile.length) {
            this.clear()
            this.menusPile[0].open()
            this.show()
        }
    }

    // Replace current menu by names. Open the first one.
    replace (names) {
        this.clear()
        this.menusPile.shift()
        this.add(names)
    }

    clear () {
        this.root.innerHTML = ''
    }

    close () {
        this.clear()
        this.menusPile.shift()
        if (this.menusPile.length) this.menusPile[0].open()
        else {
            this.hide()
            this.startGame()
        }
    }

    hide () {
        this.root.style.display = 'none'
    }

    show () {
        this.root.style.display = 'block'
    }

    keypress (event) {
        if (this.menusPile.length)
            this.menusPile[0].keypress(event)
    }


    playClick() {
        this.game.playClick()
    }

    startGame() {
        this.game.readyToStart = true
        this.game.paused = false
    }

    restartGame() {
        this.game.restart()
    }

    nextLevel() {
        this.game.nextLevel()
    }
}

var gui = new Gui()
export default gui
