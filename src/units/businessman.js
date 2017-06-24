import {getRandomDirection, axialAdd} from '../map/utils'
import {randTrue} from '../noiser'
import Unit from './unit'
import Cutter from './cutter'
import Cattle from './cattle'
import Destroyer from './destroyer'

export default class Businessman extends Destroyer {
    constructor (map, coords) {
        super(map, coords, 33)
        this.fleeingFrame = 35
        this.fleeSound = 'ahh'
        this.fleeOutSound = 'aaaah'
    }

    notFleeing() {
        if (randTrue(1-1/100)) {
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
