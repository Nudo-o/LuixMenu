import { keys } from "../constants"

function onKeyup(event) {
    keys.delete(event.code)
}

export default onKeyup