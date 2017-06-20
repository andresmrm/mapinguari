import Unit from './unit'
import {getRandomDirection, findNearest} from '../map/utils'

export default class Cutter extends Unit {
    constructor (map, coords) {
        super(map, coords, 32)
        this.searchDirection = getRandomDirection()
        this.cutting = 0
        this.devastationRange = 2
    }

    notFleeing() {
        if (!this.searchTrees()) {
            this.cutTrees()
        }
    }

    searchTrees() {
        let nearest = findNearest(
            this.coords, 5, (coords) => this.map.getNearFlorestLevel(coords))
        if (nearest) {
            return this.moveTo(nearest)
        } else {
            return this.move(this.searchDirection)
        }
    }

    cutTrees() {
        this.cutting += 1
        if (this.cutting > 5) {
            this.map.devastate(this.coords, this.devastationRange)
            this.cutting = 0
        }
    }
}
