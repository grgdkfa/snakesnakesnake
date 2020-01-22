
import * as THREE from 'three';
import Cell from './cell';
import Grid from './grid';
import { DIRS, EPS, CELL } from './consts';
import { randFrom, eq } from './utils';

class Level {
	constructor(type) {
		type = type || 'cube';

		this.cells = {};
		this.group = new THREE.Group();
	}

	buildCube(size) {
		this.size = size;
		const grid = new Grid(size);

		grid.data.fill(1);

		this.makeLevel(grid);
	}

	randCell() {
		return randFrom(this.cells);
	}

	spawnFood() {
		const empty = [];
		for(let i in this.cells) {
			const c = this.cells[i];
			if(c.state == CELL.EMPTY && !c.hasNear(CELL.HEAD))
				empty.push(c);
		}
		const cell = randFrom(empty);
		cell.setState(CELL.FOOD);
	}

	addCell(x, y, z, d) {
		const cell = new Cell();
		cell.set(new THREE.Vector3(x, y, z), d);
		this.cells[`${x}-${y}-${z}-${d}`] = cell;
		this.group.add(cell.mesh);
	}

	makeLevel(grid) {
		function getDir(up, forward) {
			const p = up.dot(forward);
			// return the *up* vector for the next cell in given direction, since the cell is defined by position and up vector

			// same plane
			if(p == 0) {
				return DIRS.findIndex(x => x.equals(up));
			}

			// forward and up
			if(p > 0) {
				return DIRS.findIndex( x => x.dot(up) == 0 && x.dot(forward) < -EPS );
			}

			// forward and down
			if(p < 0) {
				return DIRS.findIndex( x => x.dot(up) == 0 && x.dot(forward) > EPS );
			}
		}

		grid.forEach((x, y, z, solid) => {
			if(!solid) return;

			for(let d=0; d<DIRS.length; d++) {
				if(!grid.getD(x, y, z, d)) {
					this.addCell(x, y, z, d);
				}
			}
		});

		// tie every cell together (todo: make a more elegant way)
		for(let i in this.cells) {
			const cell = this.cells[i];

			for(let d=0; d<DIRS.length; d++) {
				const dir = DIRS[d];
				if(cell.up.dot(dir) != 0) continue;
				
				const p = new THREE.Vector3();
				const f = new THREE.Vector3();

				// up (forward and up)
				f.copy(dir);
				f.add(cell.up);
				p.copy(cell.index);
				p.add(f);
				if(grid.get(p)) {
					const targetDir = getDir(cell.up, f);
					cell.neighbors[d] = this.cells[`${p.x}-${p.y}-${p.z}-${targetDir}`];
				}

				f.copy(dir);
				p.copy(cell.index);
				p.add(f);
				if(grid.get(p)) {
					// forward
					const targetDir = getDir(cell.up, f);
					cell.neighbors[d] = this.cells[`${p.x}-${p.y}-${p.z}-${targetDir}`];
				} else {
					// down (same cube, different direction)
					const targetDir = getDir(cell.up, f.addScaledVector(cell.up, -1));
					p.copy(cell.index);
					cell.neighbors[d] = this.cells[`${p.x}-${p.y}-${p.z}-${targetDir}`];
				}
			}
		}

		const offset = new THREE.Vector3(-grid.x / 2, -grid.y / 2, -grid.z / 2);
		for(let i in this.cells) {
			const cell = this.cells[i];
			cell.mesh.position.add(offset);
		}
	}
}

export default Level;