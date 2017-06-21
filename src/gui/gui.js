import * as Menus from './menus';


class Gui {
    constructor () {
        this.menus = {}
        Object.keys(Menus).forEach((menuCls) => {
            let menu = new Menus[menuCls]()
            this.menus[menu.name] = menu
        })
    }

    open (name) {
        this.menus[name].open()
    }
}

export default new Gui()
