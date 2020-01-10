
import * as THREE from 'three';
import { CELL, DIRS } from './consts';
import { randFrom, dirIndex } from './utils';

class Snake {
    constructor(head) {
        if(head) {
            this.init(head);
        }
    }

    init(head) {
        this.head = head;
        this.body = [];

        const dir = randFrom(head.neighbors.map((x, i) => x === null ? -1 : i).filter(x => x > -1));
        this.direction = DIRS[dir];
        const opposite = (dir + 3) % 6;
        this.body.push(head.neighbors[opposite]);

        this.head.setState(CELL.HEAD);
        this.body.forEach(x => x.setState(CELL.BODY));
    }

    // 1: right, -1: left
    turn(direction) {
        this.direction.cross(this.head.up);
        if(direction < 0) {
            this.direction.negate();
        }
    }

    step() {
        if(this.body.length) {
            this.body[this.body.length - 1].setState(CELL.EMPTY);
        }
        const dir = dirIndex(this.direction);
        this.head.setState(CELL.BODY);
        this.head = this.head.neighbors[dir];
        this.head.setState(CELL.HEAD);
    }
}

export default Snake;