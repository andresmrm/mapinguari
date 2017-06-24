import Unit from './unit'

export default class Destroyer extends Unit {
    constructor (map, coords, tile) {
        super(map, coords, tile)
        this.map.destroyers += 1
        this.destroyer = true
    }

    freakOutCheck() {
        if (this.fear > 10) {
            this.notDestroyAnymore()
            this.fear = 10000
            this.playSound(this.fleeOutSound)
        }
    }

    notDestroyAnymore() {
        if (this.destroyer) {
            this.map.destroyers -= 1
            this.destroyer = false
        }
    }

    destroy() {
        this.notDestroyAnymore()
        super.destroy()
    }
}

