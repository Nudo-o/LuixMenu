import onBlur from "./onBlur.js"
import onFocus from "./onFocus.js"
import onKeydown from "./onKeydown.js"
import onKeyup from "./onKeyup.js"

function initEvents() {
    window.addEventListener("keydown", onKeydown, false)
    window.addEventListener("keyup", onKeyup, false)

    const allInputs = [...document.querySelectorAll("input")]

    for (const input of allInputs) {
        input.addEventListener("focus", onFocus)
        input.addEventListener("blur", onBlur)
    }
}

export default initEvents