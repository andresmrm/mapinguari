import Menu from '../menu'


export default class Win extends Menu {
    constructor (manager) {
        super(manager)
        this.name = 'win'
    }

    open () {
        this.addTitle('we won!')
        this.addText('-win')
        this.addButton('next month', () => {
            this.manager.nextLevel()
            this.close()
        })
    }
}
