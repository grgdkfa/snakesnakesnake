import EPS from './consts';


export function randFrom(something) {
    if(Array.isArray(something)) {
        return array[Math.random() * array.length | 0];
    }
    const keys = Object.keys(something);
    return something[keys[Math.random() * keys.length | 0]];
}

export function eq(a, b) {
    return Math.abs(a - b) < EPS;
}