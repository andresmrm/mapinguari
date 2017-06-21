import t from '../../i18n/i18n'

export default class {
    constructor () {
        this.name = 'langPicker'
    }

    open () {
        let el = document.querySelector('#gui-content')
        let te = t('title')
        el.innerHTML = '<h1>'+te+'</h1>'
    }
}
