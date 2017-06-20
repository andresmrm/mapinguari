import {getRandomDirection, axialAdd} from '../map/utils'
import {randTrue} from '../noiser'
import Unit from './unit'
import Cutter from './cutter'
import Cattle from '../units/cattle'

export default class Businessman extends Unit {
    constructor (map, coords) {
        super(map, coords, 33)
        this.fleeingFrame = 35
    }

    notFleeing() {
        if (randTrue(0.8)) {
            this.wanderer()
        } else {
            if (randTrue(0.5))
                new Cutter(this.map, axialAdd(this.coords, getRandomDirection()))
            else
                new Cattle(this.map, axialAdd(this.coords, getRandomDirection()))
        }
    }
}
