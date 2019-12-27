
import * as THREE from 'three';
import {CELL, DIRS} from './consts';

const baseGeometry = new THREE.PlaneGeometry(1, 1);

const materials = {
	EMPTY: new THREE.MeshLambertMaterial({ color: 0xaaaaaa }),
    BODY: new THREE.MeshBasicMaterial({ color: 0x33dd33 }),
    HEAD: new THREE.MeshLambertMaterial({ color: 0xdd3333 }),
    FOOD: new THREE.MeshBasicMaterial({ color: 0xdddd33 })
};

for(const i in CELL) {
	materials[CELL[i]] = materials[i];
}

const HALFWAY = new THREE.Vector3(0.5, 0.5, 0.5);

class Cell {
	constructor() {
		this.state = CELL.EMPTY; 
		this.up = new THREE.Vector3(0, 0, 0);
		this.mesh = new THREE.Mesh(baseGeometry, materials.EMPTY);
		this.neighbors = [null, null, null, null, null, null];
	}

	set(position, upDirection) {
		this.index = {
			x: position.x,
			y: position.y,
			z: position.z,
			d: upDirection
		};
		this.mesh.position.copy(position);
		this.mesh.position.add(HALFWAY);
		this.up.copy(DIRS[upDirection]);
		this.mesh.position.addScaledVector(this.up, 0.5);
		this.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), DIRS[upDirection]); 
	}

	setState(state) {
		this.state = state;
		this.mesh.material = materials[state];
	}
}

export default Cell;