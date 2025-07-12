import buildCSS from "!css-loader!./css/build.css"
import hudHTML from "!html-loader!./html/hud.html"
import { menu } from "../../constants"

class Hud {
    constructor() {
        this.modulesInfo = new Map()

        this.style = document.createElement("style")

        this.holder = null
        this.modulesInfoWrapper = null
        this.modulesInfoList = null
        this.notificationsList = null
        
        this.rainbowIndex = 0
        this.updateRanbowTime = null
        this.updateRainbowRate = 50

        this.removeNotificationTime = 5

        this.build()
    }

    rainbowColor(offset) {
        const frequency = .4
        const amplitude = 127
        const center = 128

        const getRGBComponent = (addOffset) => {
            return Math.sin(frequency * this.rainbowIndex + (offset + addOffset)) * amplitude + center
        }

        const red = getRGBComponent(0)
        const green = getRGBComponent(2)
        const blue = getRGBComponent(4)

        return `rgb(${[red, green, blue].map(Math.round).join(", ")})`
    }

    getNotificationElement(type, content) {
        const notification = document.createElement("li")

        notification.classList.add("hud-notification-item")

        notification.setAttribute("type", type)

        const urlStart = "https://media.discordapp.net/attachments/1117260744426262648"
        const logoURLs = {
            enabled: `${urlStart}/1155220050312188084/toggles.png?width=473&height=473`,
            disabled: `${urlStart}/1155220050312188084/toggles.png?width=473&height=473`,
            debug: `${urlStart}/1155243491471937697/orrery.png?width=473&height=473`
        }

        notification.insertAdjacentHTML("beforeend", `
        <svg class="hud-notification-progress-bar" viewbox="0 0 40 40" width="40" height="40">
            <circle cx="20" cy="20" r="15"/>

            <image class="hud-notification-logo" href="${logoURLs[type]}" height="20" width="20" x="30" y="-10"/>
        </svg>

        <header class="hud-notification-header">
            <span>${content}</span>
            <span>${["enabled", "disabled"].includes(type) ? type : ""}</span>
        </header>
        `)

        return notification
    }

    createNotification(type, content) {
        const notification = this.getNotificationElement(type, content)

        this.notificationsList.prepend(notification)

        setTimeout(() => {
            notification.remove()
        }, this.removeNotificationTime * 1000)
    }

    getModuleInfoElement(module) {
        const moduleInfo = document.createElement("li")

        moduleInfo.classList.add("hud-modules-info-item")

        moduleInfo.style.color = this.modulesInfoTextColor

        moduleInfo.textContent = module.header.name

        return moduleInfo
    }
    
    createModuleInfo(module) {
        const moduleInfo = this.getModuleInfoElement(module)

        this.modulesInfoList.appendChild(moduleInfo)

        this.modulesInfo.set(module.header.name, moduleInfo)
    }

    updateModulesInfo() {
        let modules = [...menu.builder.togglers.values()].filter((toggler) => {
            const isActive = toggler.header.toggler?.state
            const isVisible = menu.getModuleState(`${toggler.category}_visible`)

            return isActive && isVisible
        })
        
        const sortMode = menu.getModuleState("active_modules_list_sort_mode")
        const [ lengthSortMode, alphabetSortMode ] = sortMode

        if (lengthSortMode) {
            modules = modules.sort((a, b) => b.header.name.length - a.header.name.length)
        } else if (alphabetSortMode) {
            modules = modules.sort((a, b) => a.header.name - b.header.name)
        }

        this.modulesInfoList.innerHTML = ""

        this.modulesInfo.clear()

        for (const module of modules) {
            this.createModuleInfo(module)
        }
    }

    initNodes() {
        this.holder = document.getElementById("hud_holder")
        this.modulesInfoWrapper = document.getElementById("hud_modules_info_wrapper")
        this.modulesInfoList = document.getElementById("hud_modules_info_list")
        this.notificationsList = document.getElementById("hud_notifications_list")
    }

    buildCSS() {
        this.style.insertAdjacentHTML("beforeend", buildCSS.toString())

        document.head.appendChild(this.style)
    }

    buildHTML() {
        const gameUI = document.getElementById("gameUI")

        gameUI.insertAdjacentHTML("beforeend", hudHTML)

        this.initNodes()
    }

    onFrameUpdate() {
        requestAnimationFrame(this.onFrameUpdate.bind(this))

        const isRainbowActive = menu.getModuleState("active_modules_list_rainbow_color")
        const isActiveModulesList = menu.getModuleState("active_modules_list")

        if (isActiveModulesList) {
            if (this.modulesInfoWrapper.classList.contains("hidden")) {
                this.modulesInfoWrapper.classList.remove("hidden")
            }

            const textScale = menu.getModuleState("active_modules_list_text_scale")

            if (this.modulesInfoList.style.transform !== `scale(${textScale})`) {
                this.modulesInfoList.style.transform = `scale(${textScale})`
            }

            if (isRainbowActive && (!this.updateRanbowTime || Date.now() - this.updateRanbowTime >= this.updateRainbowRate)) {
                this.rainbowIndex += -1

                this.updateRanbowTime = Date.now()
            }

            const modulesInfo = [...this.modulesInfo.values()]

            for (let i = 0; i < modulesInfo.length; i++) {
                const moduleInfo = modulesInfo[i]
                const isRainbowActive = menu.getModuleState("active_modules_list_rainbow_color")
                const textColorValue = menu.getModuleState("active_modules_list_text_color")
                const textColor = isRainbowActive ? this.rainbowColor(i) : textColorValue

                if (moduleInfo.style.color == this.modulesInfoTextColor) continue
                
                moduleInfo.style.color = textColor
            }
        } else {
            if (!this.modulesInfoWrapper.classList.contains("hidden")) {
                this.modulesInfoWrapper.classList.add("hidden")
            }
        }
    }

    build() {
        this.buildCSS()

        this.buildHTML()

        requestAnimationFrame(this.onFrameUpdate.bind(this))
    }
}

export default Hud