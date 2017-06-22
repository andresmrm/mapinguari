import Menu from '../menu'


export default class GameMenu extends Menu {
    constructor (manager) {
        super(manager)
        this.name = 'gamemenu'
    }

    open () {
        this.addTitle('menu')
        this.addButton('instructions', () => {
            this.manager.add(['instructions'])
        })
        this.addButton('restart game', () => {
            this.manager.restartGame()
            this.close()
        })
        this.addButton('voltar', () => {
            this.close()
        })
    }
}
