import Menu from '../menu'


export default class GameMenu extends Menu {
    constructor (manager) {
        super(manager)
        this.name = 'gamemenu'
    }

    open () {
        this.addTitle('-title')
        this.addButton('instructions', () => {
            this.manager.add(['instructions'])
        })
        this.addButton('language', () => {
            this.manager.add(['langPicker'])
        })
        this.addButton('change hotkeys', () => {
            this.manager.add(['hotkeys'])
        })
        this.addButton('restart game', () => {
            this.manager.restartGame()
            this.close()
        })
        this.addButton('about', () => {
            this.manager.add(['about'])
        })
        this.addButton('back', () => {
            this.close()
        })
    }
}
