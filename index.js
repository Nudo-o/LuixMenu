import { menu, settings, hud, fastMenu } from "./constants.js"
import initEvents from "./events/initEvents.js"

menu.builder.afterBuild = function() {  
    for (const key of Object.keys(settings.built)) {
        const category = document.querySelector(`.module-menu-category[data-category="${key}"]`)

        if (category) {
            menu.builder.setCategoryTogglerState(category, settings.built[key])

            continue
        }

        const togglerItem = document.querySelector(`.module-setting-item[data-toggler-id="${key}"]`)

        if (typeof settings.built[key] === 'boolean' && togglerItem) {
            menu.builder.setTogglerState(togglerItem, settings.built[key])

            continue
        }

        const inputItem = document.querySelector(`.module-setting-item[data-input-id="${key}"]`)

        if (typeof settings.built[key] === 'string' && inputItem) {
            menu.builder.setInputState(inputItem, settings.built[key])
        }

        const rangeItem = document.querySelector(`.module-setting-item[data-range-id="${key}"]`)

        if (typeof settings.built[key] === 'number' && rangeItem) {
            menu.builder.setRangeState(rangeItem, settings.built[key])
        }

        const modesItem = document.querySelector(`.module-setting-item[data-modes-id="${key}"]`)

        if (Array.isArray(settings.built[key]) && modesItem) {
            menu.builder.setModesState(modesItem, settings.built[key])
        }
    }

    hud.updateModulesInfo()

    fastMenu.build()

    initEvents()
}

menu.builder.onChangeState = function(category, config, state) {    
    if (config.header.toggler) {
        settings.set(category, config.header.toggler.state)
    }

    if (Array.isArray(state)) {
        for (const setting of config.settings) {
            if (setting.type !== "modes") continue

            settings.set(setting.id, state)
        }

        return
    }

    for (const setting of config.settings) {
        if (setting.type === "modes") continue

        settings.set(setting.id, setting.state)
    }

    hud.updateModulesInfo()
}

menu.builder.onChangeMode = function(id, state) {
    switch (id) {
        case "client_menu_theme":
            const theme = state.toLowerCase().replace(/\//g, "_")

            menu.holder.setAttribute("colorshema", theme)
        break
    }

    hud.updateModulesInfo()
}

window.settings = settings
window.hud = hud
window.menu = menu
window.fastMenu = fastMenu