function isRenderObject(object) {
    return typeof object.renderX !== 'undefined' && typeof object.renderY !== 'undefined'
}

function initProps(props) {
    if (typeof props !== 'object') return

    for (const entire of Object.entries(props)) {
        if (this[entire[0]] instanceof Function) continue

        this[entire[0]] = entire[1]
    }
}

function addContextUtils(context) {
    if (!context?.canvas) return null

    context.line = function(x1, y1, x2, y2) {
        this.beginPath()
        this.moveTo(x1, y1)
        this.lineTo(x2, y2)
        this.closePath()
    }

    context.tracer = function(target, other, props) {
        if (!isRenderObject(target) || !isRenderObject(other)) return

        this.save()
        
        initProps.call(this, props)

        this.line(
            target.renderX, target.renderY, 
            other.renderX, other.renderY
        )

        if (this.fillStyle) this.fill()

        if (this.strokeStyle) this.stroke()

        this.restore()
    }

    return context
}

export default addContextUtils