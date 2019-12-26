
import * as THREE from 'three';
import { DIRS } from './consts';

class Grid {
    constructor(x, y, z) {
        y = y || x;
        z = z || y;
        this.x = x;
        this.y = y;
        this.z = z;
        this.data = new Array(x * y * z);
        this.data.fill(0);
    }

    get(x, y, z) {
        if(x instanceof THREE.Vector3) {
            y = x.y;
            z = x.z;
            x = x.x;
        }
        if(x < 0 || x >= this.x || y < 0 || y >= this.y || z < 0 || z >= this.z) {
            return 0;
        }
        const i = x * this.y * this.z + y * this.x + z;
        return this.data[i];
    }

    getD(x, y, z, d) {
        if(x instanceof THREE.Vector3) {
            d = y;
            y = x.y;
            z = x.z;
            x = x.x;
        }
        d = DIRS[d];
        x += d.x;
        y += d.y;
        z += d.z;
        return this.get(x, y, z);
    }

    set(x, y, z, v) {
        if(x instanceof THREE.Vector3) {
            v = y;
            y = x.y;
            z = x.z;
            x = x.x;
        }
        if(x < 0 || x >= this.x || y < 0 || y >= this.y || z < 0 || z >= this.z) {
            return;
        }
        const i = x * this.y * this.z + y * this.z + z;
        this.data[i] = v;
    }

    forEach(callback) {
        for(let x=0; x<this.x; x++) {
            for(let y=0; y<this.y; y++) {
                for(let z=0; z<this.z; z++) {
                    const i = x * this.y * this.z + y * this.z + z;
                    callback(x, y, z, this.data[i]);
                }
            }
        }
    }
}

export default Grid;