import { fastMenu, settings } from "../../../constants"
import togglers from "../settings/togglers"

class Builder {
    constructor() {
        this.togglers = new Map()
    }

    onChangeState() {}

    afterBuild() {}

    getCategoryHTML(category, toggler, isCopy) {
        const isActive = toggler.header.toggler?.state === true ? " is-active": ""
        const hasOpenArrow = toggler.settings?.length ? " has-open-arrow" : ""
        const addCopy = isCopy ? "copy-" : ""

        return `
        <box class="module-menu-category${isActive}" data-${addCopy}category="${category}">
            <header class="module-menu-box-header">
                <div class="module-menu-box-header-name${hasOpenArrow}">
                    <span>${toggler.header.name}</span>
                </div>

                ${toggler.header.toggler ? "<div class=\"module-menu-header-toggler\"></div>" : ""}
            </header>

            <ul class="module-settings-wrapper"></ul>
        </box>
        `
    }

    getSettingsHTML(setting, isCopy) {
        const addCopy = isCopy ? "copy-" : ""
        const isActive = setting.state === true ? " is-active": ""
        const modeLines = setting.type === "modes" ? [...setting.states].map((state, index) => `
        <li class="module-setting-mode-modes-item${state.state ? " is-active" : ""}" data-${addCopy}mode-line-index="${index}"></li>
        `).join("") : null
        const activeMode = setting.type === "modes" ? [...setting.states].filter((state) => state.state)[0] : null

        return {
            checkbox: `
            <li class="module-setting-item toggler-setting${isActive}" data-${addCopy}toggler-id="${setting.id}">
                <span>${setting.name}</span>

                <div class="module-setting-toggler"></div>
            </li>
            `,
            input: `
            <li class="module-setting-item input-setting" data-${addCopy}input-id="${setting.id}">
                <span>${setting.name}</span>

                <input class="module-setting-input" value="${setting.state}" placeholder="${setting.placeholder}" maxlength="${setting.maxLength}">
            </li>
            `,
            color: `
            <li class="module-setting-item color-setting" data-${addCopy}input-id="${setting.id}">
                <span>${setting.name}</span>

                <input class="module-setting-color" type="color" value="${setting.state}">
            </li>
            `,
            range: `
            <li class="module-setting-item range-setting" data-${addCopy}range-id="${setting.id}">
                <span>${setting.name}</span>

                <div style="display: flex; align-items: center; gap: 5px;">
                    <span class="module-setting-range-value" value="${setting.state}"></span>

                    <input class="module-setting-range" type="range" value="${setting.state}" min="${setting.min}" max="${setting.max}" step="${setting.step || 1}">
                </div>
            </li>
            `,
            modes: `
            <li class="module-setting-item mode-setting" data-${addCopy}modes-id="${setting.id}">
                <span>${setting.name}</span>

                <div class="module-setting-mode">
                    <div class="module-setting-mode-actions">
                        <div class="module-setting-mode-arrow arrow-left"></div>

                        <span class="module-setting-mode-value">${activeMode?.name}</span>

                        <div class="module-setting-mode-arrow arrow-right"></div>
                    </div>

                    <ul class="module-setting-mode-modes-wrapper">${modeLines}</ul>
                </div>
            </li>
            `,
            keybind: `
            <li class="module-setting-item keybind-setting" data-${addCopy}input-id="${setting.id}">
                <span>${setting.name}</span>

                <input class="module-setting-keybind" value="${setting.state}" placeholder="Press key..." readonly>
            </li>
            `
        }
    }

    create(category, toggler, noSave = false, isCopy) {
        !noSave && this.togglers.set(category, JSON.parse(JSON.stringify(toggler)))

        const moduleMenu = document.querySelector(`.module-menu-container[data-m-menuname="${toggler.moduleMenuName}"]`)

        moduleMenu.insertAdjacentHTML("beforeend", this.getCategoryHTML(category, toggler, isCopy))

        const addCopy = isCopy ? "copy-" : ""
        const categoryToggler = document.querySelector(`.module-menu-category[data-${addCopy}category="${category}"]`)
        const headerToggler = categoryToggler.querySelector(`.module-menu-header-toggler`)
        const headerName = categoryToggler.querySelector(`.module-menu-box-header-name`)

        this.addSettingsOpenToggler(category, headerName, isCopy)

        if (toggler.header.toggler) {
            this.addHeaderTogglerEvent(category, headerToggler, isCopy)
        }

        const settingsWrapper = categoryToggler.querySelector(`.module-settings-wrapper`)

        for (let i = 0; i < toggler.settings.length; i++) {
            const setting = toggler.settings[i]
            const html = this.getSettingsHTML(setting, isCopy)
            
            if (!html[setting.type]) continue

            settingsWrapper.insertAdjacentHTML("beforeend", html[setting.type])

            switch (setting.type) {
                case "checkbox":
                    const togglerItem = document.querySelector(`.module-setting-item[data-${addCopy}toggler-id="${setting.id}"]`)

                    this.addTogglerEvents(category, setting, togglerItem, isCopy)
                break

                case "input": 
                    const inputItem = document.querySelector(`.module-setting-item[data-${addCopy}input-id="${setting.id}"]`)

                    this.addInputEvents(category, setting, inputItem, isCopy)
                break

                case "color": 
                    const colorItem = document.querySelector(`.module-setting-item[data-${addCopy}input-id="${setting.id}"]`)

                    this.addColorEvents(category, setting, colorItem, isCopy)
                break

                case "range":
                    const rangeItem = document.querySelector(`.module-setting-item[data-${addCopy}range-id="${setting.id}"]`)

                    this.addRangeEvents(category, setting, rangeItem, isCopy) 
                break

                case "modes":
                    const modesItem = document.querySelector(`.module-setting-item[data-${addCopy}modes-id="${setting.id}"]`)

                    this.addModesEvents(category, setting, modesItem, isCopy) 
                break

                case "keybind":
                    const keybindItem = document.querySelector(`.module-setting-item[data-${addCopy}input-id="${setting.id}"]`)

                    this.addKeybindEvents(category, setting, keybindItem, isCopy) 
                break
            }
        }
    }

    setCategoryTogglerState(category, state) {
        const categoryID = category.getAttribute("data-category")
        const headerToggler = this.togglers.get(categoryID).header.toggler
        
        if (state) {
            category.classList.add("is-active")
        } else {
            category.classList.remove("is-active")
        }

        headerToggler.state = state
    }

    setTogglerState(toggler, state) {
        const category = toggler.parentElement.parentElement
        const categoryID = category.getAttribute("data-category")
        const togglerID = toggler.getAttribute("data-toggler-id")
        const settingToggler = this.togglers.get(categoryID).settings.find(
            (item) => item.id === togglerID
        )

        if (state) {
            toggler.classList.add("is-active")
        } else {
            toggler.classList.remove("is-active")
        }

        settingToggler.state = state
    }

    setInputState(input, state) {
        let inputItem = input.querySelector(`.module-setting-input`)

        const keybindItem = input.querySelector(`.module-setting-keybind`)

        if (!inputItem && !keybindItem) {
            inputItem = input.querySelector(`.module-setting-color`)
        }

        if (keybindItem) {
            inputItem = keybindItem
        }

        const category = input.parentElement.parentElement
        const categoryID = category.getAttribute("data-category")
        const inputID = input.getAttribute("data-input-id")
        const settingInput = this.togglers.get(categoryID).settings.find(
            (item) => item.id === inputID
        )

        inputItem.value = state
        settingInput.state = state
    }

    setRangeState(range, state) {
        const rangeItem = range.querySelector(`.module-setting-range`)
        const category = range.parentElement.parentElement
        const categoryID = category.getAttribute("data-category")
        const rangeID = range.getAttribute("data-range-id")
        const settingInput = this.togglers.get(categoryID).settings.find(
            (item) => item.id === rangeID
        )
        const fixedState = /\./.test(state) ? parseFloat(state).toFixed(2) : state
        const rangeValue = rangeItem.previousElementSibling

        rangeValue.setAttribute("value", fixedState)

        rangeItem.value = state
        settingInput.state = state
    }

    setModesState(modes, state) {
        const modesItem = modes.querySelector(`.module-setting-mode`)
        const category = modes.parentElement.parentElement
        const categoryID = category.getAttribute("data-category")
        const modesID = modes.getAttribute("data-modes-id")
        const settingModes = this.togglers.get(categoryID).settings.find(
            (item) => item.id === modesID
        )
        const allModeLines = [...modesItem.querySelectorAll(".module-setting-mode-modes-item")]

        allModeLines.forEach((modeLine) => {
            modeLine.classList.remove("is-active")
        })

        for (let i = 0; i < settingModes.states.length; i++) {
            settingModes.states[i].state = false
        }

        for (let i = 0; i < state.length; i++) {
            if (!state[i]) continue

            settingModes.states[i].state = true

            const activeModeValue = modesItem.querySelector(".module-setting-mode-value")
            const activeModeLine = modesItem.querySelector(`.module-setting-mode-modes-item[data-mode-line-index="${i}"]`)

            activeModeValue.textContent = settingModes.states[i].name
            activeModeLine.classList.add("is-active")

            this.onChangeMode(settingModes.id, settingModes.states[i].name)
        }
    }

    addTogglerEvents(category, setting, togglerItem) {
        const toggler = togglerItem.querySelector(`.module-setting-toggler`)

        toggler.addEventListener("click", () => {
            const settingToggler = this.togglers.get(category).settings.find(
                (item) => item.id === setting.id
            )

            togglerItem.classList.toggle("is-active")

            settingToggler.state = !settingToggler.state

            this.onChangeState(category, this.togglers.get(category), settingToggler.state)

            const attrs = togglerItem.getAttributeNames().find((attr) => /copy/.test(attr))

            if (attrs) {
                const originalToggler = document.querySelector(`[data-toggler-id=${settingToggler.id}]`)

                originalToggler.classList.toggle("is-active")
            } else {
                const copyToggler = document.querySelector(`[data-copy-toggler-id=${settingToggler.id}]`)

                if (!copyToggler) return

                copyToggler.classList.toggle("is-active")
            }
        })
    }

    addInputEvents(category, setting, inputItem) {
        const input = inputItem.querySelector(`.module-setting-input`)

        input.addEventListener("input", (event) => {
            const settingInput = this.togglers.get(category).settings.find(
                (item) => item.id === setting.id
            )

            settingInput.state = event.target.value

            this.onChangeState(category, this.togglers.get(category), event.target.value)

            const attrs = inputItem.getAttributeNames().find((attr) => /copy/.test(attr))

            if (attrs) {
                const originalInputItem = document.querySelector(`[data-input-id="${settingInput.id}"]`)
                const originalInput = originalInputItem.querySelector(`.module-setting-input`)

                originalInput.value = event.target.value
            } else {
                const copyInputItem = document.querySelector(`[data-copy-input-id="${settingInput.id}"]`)

                if (!copyInputItem) return

                const copyInput = copyInputItem.querySelector(`.module-setting-input`)
    
                copyInput.value = event.target.value
            }
        })
    }

    addColorEvents(category, setting, inputItem) {
        const color = inputItem.querySelector(`.module-setting-color`)

        color.addEventListener("input", (event) => {
            const settingColor = this.togglers.get(category).settings.find(
                (item) => item.id === setting.id
            )

            settingColor.state = event.target.value

            this.onChangeState(category, this.togglers.get(category), event.target.value)

            const attrs = inputItem.getAttributeNames().find((attr) => /copy/.test(attr))

            if (attrs) {
                const originalColorItem = document.querySelector(`[data-input-id="${settingColor.id}"]`)
                const originalColor = originalColorItem.querySelector(`.module-setting-color`)
        
                originalColor.value = event.target.value
            } else {
                const copyColorItem = document.querySelector(`[data-copy-input-id="${settingColor.id}"]`)

                if (!copyColorItem) return

                const copyColor = copyColorItem.querySelector(`.module-setting-color`)
        
                copyColor.value = event.target.value
            }
        })
    }

    addRangeEvents(category, setting, rangeItem) {
        const range = rangeItem.querySelector(`.module-setting-range`)

        range.addEventListener("input", (event) => {
            const settingRange = this.togglers.get(category).settings.find(
                (item) => item.id === setting.id
            )
            const fixedValue = /\./.test(event.target.value) ? settingRange.state.toFixed(2) : event.target.value
            const rangeValue = range.previousElementSibling

            rangeValue.setAttribute("value", fixedValue)

            range.value = event.target.value
            settingRange.state = parseFloat(event.target.value)

            this.onChangeState(category, this.togglers.get(category), parseFloat(event.target.value))

            const attrs = rangeItem.getAttributeNames().find((attr) => /copy/.test(attr))

            if (attrs) {
                const originalRangeItem = document.querySelector(`[data-range-id="${settingRange.id}"]`)
                const originalRange = originalRangeItem.querySelector(`.module-setting-range`)
                const originalRangeValue = originalRange.previousElementSibling

                originalRangeValue.setAttribute("value", fixedValue)

                originalRange.value = event.target.value
            } else {
                const copyRangeItem = document.querySelector(`[data-copy-range-id="${settingRange.id}"]`)

                if (!copyRangeItem) return

                const copyRange = copyRangeItem.querySelector(`.module-setting-range`)
                const copyRangeValue = copyRange.previousElementSibling

                copyRangeValue.setAttribute("value", fixedValue)
        
                copyRange.value = event.target.value
            }
        })
    }

    addModesEvents(category, setting, modesItem, isCopy) {
        const mode = modesItem.querySelector(`.module-setting-mode`)
        const leftArrow = mode.querySelector(".arrow-left")
        const rightArrow = mode.querySelector(".arrow-right")

        const onArrowClick = (type) => {
            const settingModes = this.togglers.get(category).settings.find(
                (item) => item.id === setting.id
            )
            const activeModeValue = mode.querySelector(".module-setting-mode-value")

            let activeStateIndex = null
            
            for (let i = 0; i < settingModes.states.length; i++) {
                if (settingModes.states[i].state) {
                    activeStateIndex = i

                    break
                }
            }

            if (typeof settingModes.states[activeStateIndex + (type ? 1 : -1)] === 'undefined') return

            settingModes.states[activeStateIndex].state = false

            const nextState = settingModes.states[activeStateIndex + (type ? 1 : -1)]

            activeModeValue.textContent = nextState.name

            nextState.state = true

            const addCopy = isCopy ? "copy-" : ""
            const nextModeLine = mode.querySelector(`.module-setting-mode-modes-item[data-${addCopy}mode-line-index="${activeStateIndex + (type ? 1 : -1)}"]`)

            const allModeLines = [...modesItem.querySelectorAll(".module-setting-mode-modes-item")]

            allModeLines.forEach((modeLine) => {
                modeLine.classList.remove("is-active")
            })

            nextModeLine.classList.add("is-active")

            this.onChangeState(category, this.togglers.get(category), [...settingModes.states].map((state) => state.state))
            this.onChangeMode(settingModes.id, nextState.name)

            const attrs = modesItem.getAttributeNames().find((attr) => /copy/.test(attr))

            if (attrs) {
                const originalModesItem = document.querySelector(`[data-modes-id="${settingModes.id}"]`)
                const originalMode = originalModesItem.querySelector(`.module-setting-mode`)
                const originalActiveModeValue = originalMode.querySelector(".module-setting-mode-value")
                const nextOriginalModeLine = originalMode.querySelector(`[data-mode-line-index="${activeStateIndex + (type ? 1 : -1)}"]`)
                const allOriginalModeLines = [...originalModesItem.querySelectorAll(".module-setting-mode-modes-item")]

                originalActiveModeValue.textContent = nextState.name

                allOriginalModeLines.forEach((modeLine) => {
                    modeLine.classList.remove("is-active")
                })

                nextOriginalModeLine.classList.add("is-active")
            } else {
                const copyModesItem = document.querySelector(`[data-copy-modes-id="${settingModes.id}"]`)

                if (!copyModesItem) return

                const copyMode = copyModesItem.querySelector(`.module-setting-mode`)
                const copyActiveModeValue = copyMode.querySelector(".module-setting-mode-value")
                const nextCopyModeLine = copyMode.querySelector(`[data-copy-mode-line-index="${activeStateIndex + (type ? 1 : -1)}"]`)
                const allCopyModeLines = [...copyModesItem.querySelectorAll(".module-setting-mode-modes-item")]

                copyActiveModeValue.textContent = nextState.name

                allCopyModeLines.forEach((modeLine) => {
                    modeLine.classList.remove("is-active")
                })

                nextCopyModeLine.classList.add("is-active")
            }
        }

        leftArrow.addEventListener("click", () => {
            onArrowClick(false)
        })

        rightArrow.addEventListener("click", () => {
            onArrowClick(true)
        })
    }

    addKeybindEvents(category, setting, keybindItem) {
        const keybind = keybindItem.querySelector(`.module-setting-keybind`)

        keybind.addEventListener("dblclick", (event) => {
            keybind.value = "..."
            keybind.lastKeybind = "..."

            keybind.blur()
        })

        keybind.addEventListener("focus", (event) => {
            keybind.lastKeybind = keybind.value

            keybind.value = "..."

            keybind.isFocused = true
        })

        keybind.addEventListener("blur", (event) => {
            if (keybind.value === "..." && keybind.lastKeybind === "...") {
                keybind.value = "None"
            }

            if (keybind.lastKeybind !== "..." && keybind.value === "...") {
                keybind.value = keybind.lastKeybind
            }

            keybind.isFocused = false

            const settingKeybind = this.togglers.get(category).settings.find(
                (item) => item.id === setting.id
            )
            const attrs = keybindItem.getAttributeNames().find((attr) => /copy/.test(attr))

            settingKeybind.state = keybind.value
            
            this.onChangeState(category, this.togglers.get(category), keybind.value)

            if (attrs) {
                const originalKeybindItem = document.querySelector(`[data-input-id="${settingKeybind.id}"]`)
                const originalKeybind = originalKeybindItem.querySelector(`.module-setting-keybind`)

                originalKeybind.value = keybind.value
            } else {
                const copyKeybindItem = document.querySelector(`[data-copy-input-id="${settingKeybind.id}"]`)

                if (!copyKeybindItem) return

                const copyKeybind = copyKeybindItem.querySelector(`.module-setting-keybind`)

                copyKeybind.value = keybind.value
            }
        })
    }

    addSettingsOpenToggler(category, toggler, isCopy) {
        const addCopy = isCopy ? "copy-" : ""

        toggler.addEventListener("click", () => {
            const categoryToggler = document.querySelector(`.module-menu-category[data-${addCopy}category="${category}"]`)     

            categoryToggler.classList.toggle("is-open")
        })
    }

    addHeaderTogglerEvent(category, toggler, isCopy) {
        const addCopy = isCopy ? "copy-" : ""

        toggler.addEventListener("click", () => {
            const categoryToggler = document.querySelector(`.module-menu-category[data-${addCopy}category="${category}"]`)
            const headerToggler = this.togglers.get(category).header.toggler
            const state = headerToggler.state
            
            categoryToggler.classList.toggle("is-active")

            headerToggler.state = !state

            if (fastMenu.menu.getModel(`fastmenu_${category}`)) {
                fastMenu.menu.getModel(`fastmenu_${category}`).setActive(headerToggler.state)
            }
            
            this.onChangeState(category, this.togglers.get(category), headerToggler.state)

            const attrs = categoryToggler.getAttributeNames().find((attr) => /copy/.test(attr))

            if (attrs) {
                const originalHeaderToggler = document.querySelector(`[data-category="${category}"]`)

                originalHeaderToggler.classList.toggle("is-active")
            } else {
                const copyHeaderToggler = document.querySelector(`[data-copy-category="${category}"]`)

                if (!copyHeaderToggler) return

                copyHeaderToggler.classList.toggle("is-active")
            }
        })
    }

    build() {
        const categories = Object.keys(togglers)

        for (let i = 0; i < categories.length; i++) {
            const category = categories[i]
            const toggler = togglers[category]
            
            this.create(category, toggler)
        }

        const afterBuildInterval = setInterval(() => {
            if (this.afterBuild.toString().length >= 70) {
                this.afterBuild()

                clearInterval(afterBuildInterval)
            }
        }, 500)
    }
}

export default Builder