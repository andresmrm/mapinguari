import texts from './texts'
import config from '../config'


export default function (textName) {
    let el = texts[textName],
        text = null,
        lang = config.language ? config.language : config.defaultLang
    if (el) text = el[lang]
    return text ? text : textName
}
