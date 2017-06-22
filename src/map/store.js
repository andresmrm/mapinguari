export default class Store {
    constructor(defaultValue) {
        this.store = {}
        this.defaultValue = defaultValue
    }

    toIndex(coords) {
        return coords.x+','+coords.y
    }

    set(coords, data) {
        this.store[this.toIndex(coords)] = data
    }

    // Returns a data.
    // If writable and the data doesn't exists,
    // create a default and insert in store.
    get(coords, writable=false) {
        let value = this.store[this.toIndex(coords)]
        if (!value) {
            value = Object.assign({}, this.defaultValue)
            if (writable) this.set(coords, value)
        }
        return value
    }

    destroy() {
        this.store = {}
        delete this
    }
}
