import buildCSS from "!css-loader!./css/build.css"
import menuHTML from "!html-loader!./html/menu.html"
import { keys, settings } from "../../constants"
import navModuleBtnClick from "./modules/navModuleBtnClick"
import navTabBtnsClick from "./modules/navTabBtnsClick"
import Builder from "./modules/Builder"
import Search from "./modules/Search"

class Menu {
    constructor() {
        this.builder = new Builder()
        this.search = new Search()

        this.style = document.createElement("style")

        this.holder = null
        this.navTabBtns = null
        this.navModuleBtns = null

        this.build()
    }

    get isVisible() {
        return !this.holder?.classList.contains("hidden")
    }

    getModuleState(key) {
        if (!settings.get(key)) {
            const togglers = [...this.builder.togglers.values()]
    
            let state = null
    
            togglers.forEach((toggler) => {
                if (toggler.category === key) {
                    state = toggler.header.toggler?.state || false
    
                    return
                }
    
                const setting = toggler.settings.filter((setting) => setting.id === key)[0]
    
                if (!setting) return

                if (setting.type === "modes") {
                    state = [...setting.states].map((state) => state.state)

                    return
                }
    
                state = setting.state
            })
    
            return state
        }
    
        return settings.get(key)
    }

    toggle() {
        if (!this.holder) return

        this.holder.classList.toggle("hidden")

        document.body.focus()
    }

    onKeydown(event) {
        if (event.code === "ShiftRight") {
            if (!keys.has("ShiftRight")) {
                this.toggle()
            }
        }
    }

    initNodes() {
        this.holder = document.getElementById("menu_holder")
        this.navTabBtns = document.getElementById("nav_tab_btns")
        this.navModuleBtns = document.querySelectorAll(".tab-menu-navbar-list-item")
    }

    buildCSS() {
        this.style.insertAdjacentHTML("beforeend", buildCSS.toString())

        document.head.appendChild(this.style)
    }

    buildHTML() {
        const gameUI = document.getElementById("gameUI")

        document.body.insertAdjacentHTML("beforeend", menuHTML)

        this.initNodes()
    }

    buildEvents() {
        window.addEventListener("keydown", this.onKeydown.bind(this))

        this.navTabBtns.addEventListener("click", navTabBtnsClick)

        for (let i = 0; i < this.navModuleBtns.length; i++) {
            this.navModuleBtns[i].addEventListener("click", navModuleBtnClick)
        }
    }

    build() {
        this.buildCSS()

        this.buildHTML()

        this.buildEvents()

        this.builder.build()

        this.search.init(this.builder)
    }
}

export default Menu