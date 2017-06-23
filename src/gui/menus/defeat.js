import Menu from '../menu'


export default class Defeat extends Menu {
    constructor (manager) {
        super(manager)
        this.name = 'defeat'
    }

    open () {
        this.addTitle('we lost!')
        this.addText('-defeat')
        this.addButton('restart game', () => {
            this.manager.restartGame()
            this.close()
        })
    }
}
