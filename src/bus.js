
const bus = {};

export function listen(event, callback) {
    if(!bus[event]) {
        bus[event] = [];
    }
    bus[event].push(callback);
}

export function emit(event, ...args) {
    if(bus[event]) {
        bus[event].forEach(c => c(...args));
    }
}

export function detach(event, callback) {
    if(!bus[event]) {
        return;
    }
    if(!callback) {
        delete bus[event];
        return;
    }
    const i = bus[event].findIndex(c => c === callback);
    if(i > -1) {
        bus[event].splice(i, 1);
    }
}