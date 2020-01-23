import {EPS, DIRS} from './consts';


export function randFrom(something) {
    if(Array.isArray(something)) {
        return something[Math.random() * something.length | 0];
    }
    const keys = Object.keys(something);
    return something[keys[Math.random() * keys.length | 0]];
}

export function shuffle(array) {
    array.sort((a, b) => Math.random() - 0.5);
}

export function eq(a, b) {
    return Math.abs(a - b) < EPS;
}

export function dirIndex(v) {
    return DIRS.findIndex(x => x.equals(v));
}
