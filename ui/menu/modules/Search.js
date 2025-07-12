class Search {
    constructor() {
        this.builder = null

        this.searchContainer = null
        this.searchInput = null
    }

    get value() {
        return this.searchInput?.value || ""
    }

    removeAllChilds() {
        const allChilds = [...this.searchContainer.querySelectorAll(".module-menu-category")]

        for (const child of allChilds) {
            if (child.id === "search_category") continue

            child.remove()
        }
    }

    onInput(event) {
        this.removeAllChilds()

        if (!this.value) return

        const value = this.value.toLowerCase()
        const regex = new RegExp(value)
        const togglers = [...this.builder.togglers.values()]
        const searchedTogglers = togglers.filter((toggler) => regex.test(toggler.header.name.toLowerCase()))

        if (!searchedTogglers.length) return

        for (const toggler of searchedTogglers) {
            toggler.moduleMenuName = "search"

            this.builder.create(toggler.category, toggler, true, true)
        }
    }

    buildEvents() {
        this.searchInput.addEventListener("input", this.onInput.bind(this))
    }

    init(builder) {
        this.builder = builder

        this.searchContainer = document.querySelector(`.module-menu-container[data-m-menuname="search"]`)
        this.searchInput = document.getElementById("search_input")

        this.buildEvents()
    }
}

export default Search