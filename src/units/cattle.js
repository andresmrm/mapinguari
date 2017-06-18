import Unit from './unit'

export default class Cattle extends Unit {
    constructor (map, coords) {
        super(map, coords, 34)
    }

    update() {
        this.flee()
        this.wanderer()
    }

}
