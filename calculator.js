const screen = document.querySelector(".screen")
const States = Object.freeze({
    INITIALFIRST: Symbol("initialfirst"),
    FIRST: Symbol("first"),
    INITIALMORE: Symbol("initialmore"),
    MORE: Symbol("more"),
});
const Operations = Object.freeze({
    DIVIDE:   Symbol("div"),
    MULTIPLY: Symbol("mul"),
    ADD:      Symbol("add"),
    SUBTRACT: Symbol("sub"),
    BACK:     Symbol("bck"),
    CLEAR:    Symbol("clr"),
    EQUALS:   Symbol("eqs"),
})

const opSymbolMap = Object.freeze({
    "÷": Operations.DIVIDE,
    "×": Operations.MULTIPLY,
    "-": Operations.SUBTRACT,
    "+": Operations.ADD,
})
const ctrSymbolMap = Object.freeze({
    "C": Operations.CLEAR,
    "←": Operations.BACK,
    "=": Operations.EQUALS,
})

let previous = 0
let lastOp = Operations.ADD
let state = States.INITIALFIRST

function add(left, right) {
    return left + right
}

function sub(left, right) {
    return left - right
}

function mul(left, right) {
    return left * right
}

function div(left, right) {
    return left / right
}

function clear() {
    screen.innerText = "0"
    previous = 0
    return States.INITIALFIRST
}

function back() {
    const current = screen.innerText
    const length = current.length
    if (length > 1) {
        screen.innerText = current.substring(0, length - 1)
        return state
    } else if (length <= 1) {
        screen.innerText = "0"
        if (state === States.MORE) {
            return States.INITIALMORE
        } else {
            return States.INITIALFIRST
        }
    }
}

function apply(operation, left, right) {
    previous = opFuncMap.get(operation)(left, right)
    screen.innerText = previous.toString()
}

function equals() {
    const current = parseInt(screen.innerText)
    apply(previousOp, previous, current)
    previous = 0
    return States.INITIALFIRST
}

function applyOp(operation) {
    return ctrFuncMap.get(operation)()
}

const opFuncMap = new Map([
    [Operations.ADD, add],
    [Operations.SUBTRACT, sub],
    [Operations.DIVIDE, div],
    [Operations.MULTIPLY, mul],
])

const ctrFuncMap = new Map([
    [Operations.BACK, back],
    [Operations.CLEAR, clear],
    [Operations.EQUALS, equals],
])

const stateMap = new Map([
    [States.INITIALFIRST, States.FIRST],
    [States.FIRST, States.INITIALMORE],
    [States.INITIALMORE, States.MORE],
    [States.MORE, States.INITIALMORE],
])

function dispatch(event, state) {
    request = event.target.innerText
    if (state === States.INITIALFIRST || state === States.INITIALMORE) {
        if (!isNaN(request)) {
            screen.innerText = request
            return stateMap.get(state)
        }
    }
   
    if (!isNaN(request)) {
        screen.innerText += request
        return state
    } else if (opSymbolMap.hasOwnProperty(request)) {
        const op = opSymbolMap[request]
        const current = parseInt(screen.innerText)
        if (state === States.INITIALFIRST) {
            previous = current
            previousOp = op
            return States.INITIALMORE
        } else if (state === States.FIRST) {
            previous = current
        } else {
            apply(previousOp, previous, current)
        }
        previousOp = op
        return stateMap.get(state)
    } else if (ctrSymbolMap.hasOwnProperty(request)) {
        const op = ctrSymbolMap[request]
        return applyOp(op)
    }
}

document.querySelector('.calculator').addEventListener('click', function(event) {
    state = dispatch(event, state)
});
