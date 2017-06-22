import Menu from '../menu'


export default class Intro extends Menu {
    constructor (manager) {
        super(manager)
        this.name = 'history1'
    }

    open () {
        this.addTitle('-title')
        this.addText('-history')
        this.addButton('start', () => {
            this.manager.startGame()
        })
        this.addButton('instructions', () => {
            this.manager.replace(['instructions'])
        })
    }
}
