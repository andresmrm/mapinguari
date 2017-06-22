import texts from './texts'
import config from '../config'


export default function (textName) {
    let el = texts[textName],
        text = null
    if (el) text = el[config.language]
    return text ? text : textName
}
