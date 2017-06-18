import SimplexNoise from 'simplex-noise'
import Alea from 'alea'

export var random = new Alea()
var noiseGen = new SimplexNoise(random)

// band weights
var w1 = 1, w2 = 1, w3 = 1
// band freqs
var f1 = .01, f2 = .02, f3 = .04

// n = noiseParams
export function getNoise(x, y) {
    // if (n) {
    //     // console.log('---',n.x, n.mx)
    //     // console.log('---',n.y, n.my)
    //     x = x/n.mx+n.x
    //     y = y/n.my+n.y
    // }

    // if (y > 105 && y < 115 && x > 115 && x < 125) return 1
    // else return 0
    // if (y > 100 && y < 200 && x > 100 && x < 200) return 1
    // else return 0
    // console.log(x, y)
    // TODO: tirar o pow
    return (
        noiseGen.noise2D(x*f1, y*f1) * w1 +
        noiseGen.noise2D(x*f2, y*f2) * w2 +
        noiseGen.noise2D(x*f3, y*f3) * w3
        ) / (w1+w2+w3)
}


export function randTrue(prop) {
    return random() > prop ? true : false
}
