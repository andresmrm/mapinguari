import Unit from './unit'
import {randTrue} from '../noiser'

export default class Cattle extends Unit {
    constructor (map, coords) {
        super(map, coords, 34)
        this.fleeSound = 'moo'
    }

    notFleeing() {
        this.wanderer()
        if(randTrue(0.01)) this.playSound('moo')
    }
}
