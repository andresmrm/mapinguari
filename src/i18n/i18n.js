import texts from './texts'
import config from '../config'


export default function (textName) {
    return texts[textName][config.language]
}
