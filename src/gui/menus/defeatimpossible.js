import Menu from '../menu'


export default class DefeatImpossible extends Menu {
    constructor (manager) {
        super(manager)
        this.name = 'defeatimpossible'
    }

    open () {
        this.addTitle('we lost!')
        this.addText('-defeatimpossible')
        this.addButton('restart game', () => {
            this.manager.restartGame()
            this.close()
        })
    }
}
