import Menu from '../menu'
import config from '../../config'


export default class Tracking extends Menu {
    constructor (manager) {
        super(manager)
        this.name = 'tracking'
    }

    open () {
        this.addTitle('data collection')
        this.addText('-tracking')

        if (config.trackingEnabled) {
            this.addButton('disable', () => {
                config.trackingEnabled = false
                config.save()
                this.reload()
            })
        } else {
            this.addButton('enable', () => {
                config.trackingEnabled = true
                config.save()
                this.reload()
            })
        }

        this.addText('-tracking2')
        this.addText('-tracking3')

        this.addButton('back', () => {
            this.manager.close()
        })
    }
}
