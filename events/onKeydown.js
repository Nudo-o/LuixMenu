import { fastMenu, hud, keys, menu } from "../constants"

function onKeydown(event) {
    keys.set(event.code, true)

    if (!event.key?.toUpperCase) return

    const togglers = [...menu.builder.togglers.values()]

    for (const toggler of togglers) {
        const keybinds = [...toggler.settings].filter((setting) => setting.type === "keybind")

        for (const keybind of keybinds) {
            const settingKeybind = menu.builder.togglers.get(toggler.category).settings.find(
                (item) => item.id === keybind.id
            )
            const key = event.key === "Delete" ? "None" : event.key === " " ? "SPACE" : event.key.toUpperCase()

            if (key === settingKeybind.state && document.activeElement.tagName !== "INPUT") {
                const categoryItem = document.querySelector(`.module-menu-category[data-category="${toggler.category}"]`)
                const headerToggler = menu.builder.togglers.get(toggler.category).header.toggler
        
                headerToggler.state = !headerToggler.state
        
                menu.builder.setCategoryTogglerState(categoryItem, headerToggler.state)
                menu.builder.onChangeState(toggler.category, menu.builder.togglers.get(toggler.category), headerToggler.state)
                
                if (fastMenu.menu.getModel(`fastmenu_${toggler.category}`)) {
                    fastMenu.menu.getModel(`fastmenu_${toggler.category}`).setActive(headerToggler.state)
                }

                hud.createNotification(headerToggler.state ? "enabled" : "disabled", `${toggler.header.name} is`)
            }

            const keybindItems = [
                document.querySelector(`.module-setting-item[data-input-id="${keybind.id}"]`),
                document.querySelector(`.module-setting-item[data-copy-input-id="${keybind.id}"]`)
            ]
            
            for (const keybindItem of keybindItems) {
                if (!keybindItem) continue

                const keybindInput = keybindItem.querySelector(`.module-setting-keybind`)

                const parentElement = document.activeElement.parentElement
    
                if (parentElement.id !== keybindItem.id || !keybindInput.isFocused || event.key === "Escape") continue
    
                keybindInput.value = key
            }
        }
    }

    /*
    const settingKeybind = this.togglers.get(category).settings.find(
        (item) => item.id === setting.id
    )
    const key = event.key === "Delete" ? "None" : event.key === " " ? "SPACE" : event.key.toUpperCase()

    if (key === settingKeybind.state) {
        const categoryItem = document.querySelector(`.module-menu-category[data-category="${category}"]`)
        const headerToggler = this.togglers.get(category).header.toggler

        headerToggler.state = !headerToggler.state

        this.setCategoryTogglerState(categoryItem, headerToggler.state)
        this.onChangeState(category, this.togglers.get(category), headerToggler.state)
        fastMenu.menu.getModel(`fastmenu_${category}`).setActive(headerToggler.state)

        document.title = `${category}: ${headerToggler.state}`
    }

    console.log(key)

    const parentElement = document.activeElement.parentElement

    if (parentElement.id !== keybindItem.id || !keybind.isFocused || event.key === "Escape") return

    keybind.value = key
    */
}

export default onKeydown