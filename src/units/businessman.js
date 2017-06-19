import Unit from './unit'

export default class Businessman extends Unit {
    constructor (map, coords) {
        super(map, coords, 33)
    }

    update() {
        this.flee()
        this.wanderer()
    }

}
