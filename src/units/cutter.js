import Unit from './unit'
import {getRandomDirection, findNearest} from '../map/utils'
import {randTrue} from '../noiser'
import Destroyer from './destroyer'

export default class Cutter extends Destroyer {
    constructor (map, coords) {
        super(map, coords, 32)
        this.searchDirection = getRandomDirection()
        this.cutting = 0
        this.devastationRange = 2
        this.fleeSound = 'ohh'
        this.fleeOutSound = 'aaaah'
    }

    notFleeing() {
        // TODO: Hack to avoid being stuck. moveTo shouldn't allow this.
        if (this.moveToCenter) {
            this.moveToCenter--
            this.moveTo({x:0,y:0})
        } else {
            this.moved = this.searchTrees()
            if(this.map.getNearFlorestLevel(this.coords)) {
                this.cutTrees()
            } else {
                // Not in a forest and not moving == problem
                if (!this.moved) this.moveToCenter = 10
            }
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
