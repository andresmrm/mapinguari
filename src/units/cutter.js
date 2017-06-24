import Unit from './unit'
import {getRandomDirection, findNearest} from '../map/utils'
import {randTrue} from '../noiser'

export default class Cutter extends Unit {
    constructor (map, coords) {
        super(map, coords, 32)
        this.searchDirection = getRandomDirection()
        this.cutting = 0
        this.map.destroyers += 1
        this.devastationRange = 2
        this.fleeSound = 'ohh'
    }

    notFleeing() {
        if (!this.searchTrees()) {
            this.cutTrees()
        }
    }

    destroy() {
        this.map.destroyers -= 1
        super.destroy()
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

    triedToLeaveWorld() {
        this.searchDirection = getRandomDirection()
        super.triedToLeaveWorld()
    }

    cutTrees() {
        this.cutting += 1
        if(randTrue(0.1))this.playSound('saw', this.coords)
        if (this.cutting > 10) {
            this.playSound('fallingtree', this.coords)
            this.map.devastate(this.coords, this.devastationRange)
            this.cutting = 0
        }
    }
}
