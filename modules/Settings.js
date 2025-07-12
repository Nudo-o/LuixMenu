class Settings {
    constructor() {
        this.key = "__luix_mod_settings"

        this.built = null

        this.init()
    }

    isDefined() {
        return Boolean(localStorage.getItem(this.key))
    }

    create() {
        localStorage.setItem(this.key, JSON.stringify({
            createdAt: [ Date.now(), new Date() ]
        }))
    }

    recreate() {
        localStorage.setItem(this.key, JSON.stringify(Object.assign({
            createdAt: [ Date.now(), new Date() ]
        }, this.built)))
    }

    getParsed() {
        if (!this.built) {
            this.built = JSON.parse(localStorage.getItem(this.key))
        }

        return this.built
    }

    get(key) {
        return this.built[key]
    }

    set(key, value) {
        this.built[key] = value

        this.build()
    }

    build() {
        const parsed = this.getParsed()
        const keys = Object.keys(parsed)

        for (const key of keys) {
            this[key] = parsed[key]
        }

        this.built = parsed

        this.recreate()
    }

    init() {
        !this.isDefined() && this.create()

        this.build()
    }
}

export default Settings