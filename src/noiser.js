import SimplexNoise from 'simplex-noise'
import Alea from 'alea'

export var random = new Alea()

var noiseGen = null
export function startNoiseGen() {
    noiseGen = new SimplexNoise(random)
}
startNoiseGen()


// band weights
var w1 = 1, w2 = 1, w3 = 1
// band freqs
var f1 = .01, f2 = .02, f3 = .04

// Return a noise between 0 and 1
export function getNoise(x, y) {
    return ((
        noiseGen.noise2D(x*f1, y*f1) * w1 +
            noiseGen.noise2D(x*f2, y*f2) * w2 +
            noiseGen.noise2D(x*f3, y*f3) * w3
    ) / (w1+w2+w3) + 1) / 2
}


export function randTrue(prop) {
    return random() > prop ? true : false
}


export function randInt(end, start=0) {
    return Math.round(random()*(end-start)+start)
}
