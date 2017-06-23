import {getRandomDirection, axialAdd} from '../map/utils'
import {randTrue} from '../noiser'
import Unit from './unit'
import Cutter from './cutter'
import Cattle from '../units/cattle'

export default class Businessman extends Unit {
    constructor (map, coords) {
        super(map, coords, 33)
        this.fleeingFrame = 35
        this.fleeSound = 'ahh'
        this.map.destroyers += 1
    }

    destroy() {
        this.map.destroyers -= 1
        this.sprite.destroy()
    }

    notFleeing() {
        if (randTrue(0.95)) {
            this.wanderer()
        } else {
            this.playSound('new')
            if (randTrue(0.5))
                new Cutter(this.map, axialAdd(this.coords, getRandomDirection()))
            else
                new Cattle(this.map, axialAdd(this.coords, getRandomDirection()))
        }
    }
}
