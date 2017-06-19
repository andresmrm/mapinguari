import Unit from './unit'
import {getRandomDirection} from '../map/utils'

export default class Cutter extends Unit {
    constructor (map, coords) {
        super(map, coords, 32)
        this.searchDirection = getRandomDirection()
    }

    update() {
        this.flee()
    }

    searchTrees() {
        
    }
}
