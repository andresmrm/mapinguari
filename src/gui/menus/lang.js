import Menu from '../menu'
import config from '../../config'


export default class LangPicker extends Menu {
    constructor (manager) {
        super(manager)
        this.name = 'langPicker'
    }

    open () {
        this.addButton('english', () => {
            config.language = 'en'
            config.save()
            this.close()
        })
        this.addButton('português', () => {
            config.language = 'pt'
            config.save()
            this.close()
        })
    }
}
