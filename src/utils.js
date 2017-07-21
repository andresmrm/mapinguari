import config from './config'


export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export function getKeyStr(event) {
    let str = ''
    if (event.key) {
        str = event.key
    } else {
        if(window.event) { // IE
            str = String.fromCharCode(event.keyCode)
        } else if(event.which){ // Netscape/Firefox/Opera
            str = String.fromCharCode(event.which)
        } else {
            throw 'no method to decode key code'
        }
    }
    return str
}

export function track(category, action) {
    if (config.trackingEnabled) {
        try {
            _paq.push(['trackEvent', category, action])
        } catch (e) {}
    }
}
window.track = track
