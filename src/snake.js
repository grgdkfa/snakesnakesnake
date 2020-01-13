
import * as THREE from 'three';
import { CELL, DIRS } from './consts';
import { randFrom, dirIndex } from './utils';

class Snake {
    constructor(head) {
        if(head) {
            this.init(head);
        }

        this.speed = 800; // ms
    }

    init(head) {
        this.head = head;
        this.body = [];

        const dir = randFrom(head.neighbors.map((x, i) => x === null ? -1 : i).filter(x => x > -1));
        this.direction = new THREE.Vector3();
        this.direction.copy(DIRS[dir]);
        const opposite = (dir + 3) % 6;
        this.body.push(head.neighbors[opposite]);

        this.head.setState(CELL.HEAD);
        this.body.forEach(x => x.setState(CELL.BODY));

        this.turned = false;
    }

    // 1: right, -1: left
    turn(direction) {
        if(this.turned) {
            return;
        }
        this.turned = true;
        this.direction.cross(this.head.up);
        if(direction < 0) {
            this.direction.negate();
        }
        this.direction.round();
    }

    step() {
        if(this.body.length) {
            this.body[this.body.length - 1].setState(CELL.EMPTY);
            for(let i = this.body.length - 1; i > 0; i--) {
                this.body[i] = this.body[i - 1];
            }
            this.body[0] = this.head;
            this.body[0].setState(CELL.BODY);
        } else {
            this.head.setState(CELL.EMPTY);
        }
        const dir = dirIndex(this.direction);
        const next = this.head.neighbors[dir];
        const a = new THREE.Vector3();
        a.subVectors(next.mesh.position, this.head.mesh.position);
        
        this.direction.copy(next.findDir(a));
        this.head = next;
        this.head.setState(CELL.HEAD);

        this.turned = false;
    }
}

export default Snake;