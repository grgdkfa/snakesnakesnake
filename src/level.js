
import * as THREE from 'three';
import Cell from './cell';
import Grid from './grid';
import { DIRS, EPS, CELL } from './consts';

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

		const randFrom = (a) => {
			return a[Math.random() * a.length | 0];
		}

		this.cells[randFrom(Object.keys(this.cells))].setState(CELL.HEAD);
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
			if(Math.abs(p) < EPS) {
				return DIRS.findIndex(x => x.equals(up));
			}
			if(p > 0) {
				return DIRS.findIndex( x => Math.abs(x.dot(up)) < EPS && Math.abs(x.dot(forward) < -EPS) );
			}
			if(p < 0) {
				return DIRS.findIndex( x => Math.abs(x.dot(up)) < EPS && Math.abs(x.dot(forward) > -EPS) );
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
				if(Math.abs(cell.up.dot(dir)) > EPS) continue;
				const p = new THREE.Vector3();
				const f = new THREE.Vector3();
				// up
				f.x = dir.x + cell.up.x;
				f.y = dir.y + cell.up.y;
				f.z = dir.z + cell.up.z;
				p.copy(cell.index);
				p.add(f);
				if(grid.get(p)) {
					const targetDir = getDir(cell.up, f);
					cell.neighbors[d] = this.cells[`${cell.index.x}-${cell.index.y}-${cell.index.z}-${targetDir}`];
				}

				// down
				f.x = dir.x - cell.up.x;
				f.y = dir.y - cell.up.y;
				f.z = dir.z - cell.up.z;
				p.copy(cell.index);
				p.add(f);
				if(grid.get(p)) {
					const targetDir = getDir(cell.up, f);
					cell.neighbors[d] = this.cells[`${cell.index.x}-${cell.index.y}-${cell.index.z}-${targetDir}`];
				}

				// forward
				f.x = dir.x;
				f.y = dir.y;
				f.z = dir.z;
				p.copy(cell.index);
				p.add(f);
				if(grid.get(p)) {
					const targetDir = getDir(cell.up, f);
					cell.neighbors[d] = this.cells[`${cell.index.x}-${cell.index.y}-${cell.index.z}-${targetDir}`];
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