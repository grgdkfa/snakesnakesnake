
import * as THREE from 'three';

export const CELL = {
    EMPTY: 0,
    BODY: 1,
    HEAD: 2,
    FOOD: 3
};

export const DIRS = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1),
];