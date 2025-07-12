import { client } from "../constants"

function onFocus() {
    if (!client.io.rmdStatus) {
        client.io.send("rmd")
    }
}

export default onFocus