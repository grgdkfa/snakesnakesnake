
import * as THREE from 'three';

export const CELL = {
    EMPTY: Symbol('empty'),
    BODY: Symbol('body'),
    HEAD: Symbol('head'),
    FOOD: Symbol('food')
};

export const DIRS = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1),
];

export const EPS = 1e-7;