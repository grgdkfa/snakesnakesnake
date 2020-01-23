
import * as THREE from 'three';
import {CELL, DIRS} from './consts';

const baseGeometry = new THREE.PlaneGeometry(1, 1);

const materials = {
	EMPTY: new THREE.MeshLambertMaterial({ color: 0xaaaaaa, emissive: 0x333333 }),
    BODY: new THREE.MeshLambertMaterial({ color: 0x33dd33, emissive: 0x003300 }),
    HEAD: new THREE.MeshBasicMaterial({ color: 0xdd3333 }),
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

	findDir(v) {
		let max = 0;
		let dir = new THREE.Vector3();
		for(let i=0; i<this.neighbors.length; i++) {
			if(!this.neighbors[i]) {
				continue;
			}

			const p = DIRS[i].dot(v);
			if(p > max) {
				max = p;
				dir.copy(DIRS[i]);
			}
		}
		return dir;
	}

	hasNear(type) {
		for(let i=0; i<this.neighbors.length; i++) {
			if(this.neighbors[i] && this.neighbors[i].state == type) {
				return true;
			}
		}
		return false;
	}
}

export default Cell;