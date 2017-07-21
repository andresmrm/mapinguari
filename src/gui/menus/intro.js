import Menu from '../menu'


export default class Intro extends Menu {
    constructor (manager) {
        super(manager)
        this.name = 'history1'
    }

    open () {
        this.addTitle('-title')
        this.addText('-history')
        this.addButton('instructions', () => {
            this.manager.add(['instructions'])
        })
        this.addButton('language', () => {
            this.manager.add(['langPicker'])
        })
        this.addButton('change hotkeys', () => {
            this.manager.add(['hotkeys'])
        })
        this.addButton('data collection', () => {
            this.manager.add(['tracking'])
        })
        this.addButton('about', () => {
            this.manager.add(['about'])
        })
        this.addButton('start', () => {
            this.manager.close()
        })
    }
}
