import Menu from '../menu'


export default class Instructions extends Menu {
    constructor (manager) {
        super(manager)
        this.name = 'instructions'
    }

    open () {
        this.addTitle('instructions')
        this.addText('-instructions')
        this.addButton('start', () => {
            this.manager.startGame()
        })
    }
}
