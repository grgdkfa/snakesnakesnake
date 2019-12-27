
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
		const grid = new Grid(size);

		grid.data.fill(1);
		grid.data[0] = 0;
		grid.data[size - 1] = 0;
		grid.data[size * size * size - 1] = 0;

		this.makeLevel(grid);

		debugger;

		const c = this.cells[randFrom(Object.keys(this.cells))];
		c.setState(CELL.HEAD);
		c.neighbors.forEach(x => {
			if(!x) return;
			x.setState(CELL.BODY)
		});
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
			if(eq(p, 0)) {
				return DIRS.findIndex(x => x.equals(up));
			}

			// forward and up
			if(p > 0) {
				return DIRS.findIndex( x => eq(x.dot(up), 0) && x.dot(forward) < -EPS );
			}

			// forward and down
			if(p < 0) {
				return DIRS.findIndex( x => eq(x.dot(up), 0) && x.dot(forward) > EPS );
			}
		}

		const checkCell = (cell, dir, depth) => {
			const p = new THREE.Vector3();
			const f = new THREE.Vector3();
			f.copy(dir);
			f.addScaledVector(cell.up, depth);
			p.copy(cell.index);
			p.add(f);
			if(grid.get(p)) {
				const targetDir = getDir(cell.up, f);
				cell.neighbors[d] = this.cells[`${p.x}-${p.y}-${p.z}-${targetDir}`];
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

		for(let i in this.cells) {
			const cell = this.cells[i];

			for(let d=0; d<DIRS.length; d++) {
				const dir = DIRS[d];
				if(!eq(cell.up.dot(dir), 0)) continue;
				
				// up
				checkCell(cell, dir, 1);

				// down
				checkCell(cell, dir, -1);

				// forward
				checkCell(cell, dir, 0);
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