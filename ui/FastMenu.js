import { menu } from "../constants"

class FastMenu {
    constructor() {
        this.menu = window.MooUI.createMenu({
            toggleKey: {
                code: "Escape"
            },
            appendNode: document.body
        })

        this.combat = new window.MooUI.Column()
        this.player = new window.MooUI.Column()
        this.movement = new window.MooUI.Column()
        this.misc = new window.MooUI.Column()
        this.render = new window.MooUI.Column()
    }

    buildTogglers() {
        let togglersKeys = []

        const togglers = [...menu.builder.togglers.values()]

        for (const toggler of togglers) {
            if (!toggler.header.toggler || !this[toggler.moduleMenuName]) continue

            const key = `fastmenu_${toggler.category}`

            this[toggler.moduleMenuName].add(new window.MooUI.Checkbox({
                key: key,
                name: toggler.header.name,
                description: "",
                isActive: toggler.header.toggler.state
            }))

            togglersKeys.push(key)
        }

        return togglersKeys
    }
    
    build() {
        document.head.insertAdjacentHTML("beforeend", `<style>
        .column-container {
            border-radius: 0 0 6px 6px !important;
        }

        .ui-model {
            border-radius: 4px !important;
        }
        </style>`)

        this.combat.setHeaderText("Combat")
        this.player.setHeaderText("Player")
        this.movement.setHeaderText("Movement")
        this.misc.setHeaderText("Misc")
        this.render.setHeaderText("Render")
        
        this.combat.setHeaderBgColor("#1b0808").setContainerBgColor("#1b0808")
        this.player.setHeaderBgColor("#081b1b").setContainerBgColor("#081b1b")
        this.movement.setHeaderBgColor("#081b09").setContainerBgColor("#081b09")
        this.misc.setHeaderBgColor("#17081b").setContainerBgColor("#17081b")
        this.render.setHeaderBgColor("#0b081b").setContainerBgColor("#0b081b")        

        this.combat.collisionWidth = -999999
        this.player.collisionWidth = -999999
        this.movement.collisionWidth = -999999
        this.misc.collisionWidth = -999999
        this.render.collisionWidth = -999999

        const togglersKeys = this.buildTogglers()

        this.menu.add(this.combat, this.player, this.movement, this.misc, this.render)

        for (const togglerKey of togglersKeys) {
            this.menu.getModel(togglerKey).on("click", (state) => {
                const originalKey = togglerKey.replace(/fastmenu_/, "")
                const category = document.querySelector(`.module-menu-category[data-category="${originalKey}"]`)

                menu.builder.setCategoryTogglerState(category, state)
                menu.builder.onChangeState(originalKey, menu.builder.togglers.get(originalKey), state)
            })
        }

        this.menu.columns.forEach((column) => {
            column.header.element.style.borderRadius = "6px"
            
            column.header.element.addEventListener("mousedown", (event) => {
                if (event.button !== 2) return

                column.header.isOpen ??= false
                column.header.isOpen = !column.header.isOpen

                column.header.element.style.borderRadius = column.header.isOpen ? "6px 6px 0 0" : "6px"
            })
        })
    }
}

export default FastMenu