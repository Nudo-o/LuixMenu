import gameConfig from "../gameConfig.js"

class Utils {
    static canSeePoint(target, other) {
        const dx = Math.abs(other.x - target.x) - (other?.scale || 0)
        const dy = Math.abs(other.y - target.y) - (other?.scale || 0)

        return dx <= (gameConfig.maxScreenWidth / 2) * 1.3 && dy <= (gameConfig.maxScreenHeight / 2) * 1.3
    }

    static getAngleDist(a, b) {
        const dif = Math.abs(b - a) % (Math.PI * 2)

        return (dif > Math.PI ? (Math.PI * 2) - dif : dif)
    }

    static checkGameObjectHit(player, gameObject) {
        const scale = (gameObject.scale || gameObject.getScale()) + gameConfig.collisionDepth
        const distance = Math.hypot(gameObject.y - player.y2, gameObject.x - player.x2) - scale
        const angle = Math.atan2(gameObject.y - player.y2, gameObject.x - player.x2)

        return distance <= player.weapon.range && Utils.getAngleDist(angle, player.dir2) <= gameConfig.gatherAngle
    }
}

export default Utils