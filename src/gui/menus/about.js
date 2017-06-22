import Menu from '../menu'


export default class About extends Menu {
    constructor (manager) {
        super(manager)
        this.name = 'about'
    }

    open () {
        this.addTitle('about')
        this.addText('-about')

        this.addButton('back', () => {
            this.manager.close()
        })
    }
}
