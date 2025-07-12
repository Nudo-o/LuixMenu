import { client } from "../constants"

function onBlur() {
    if (client.io.rmdStatus) {
        client.io.send("rmd")
    }
}

export default onBlur