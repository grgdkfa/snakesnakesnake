import EPS from './consts';


export function randFrom(array) {
    return array[Math.random() * array.length | 0];
}

export function eq(a, b) {
    return Math.abs(a - b) < EPS;
}