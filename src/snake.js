
import * as THREE from 'three';
import { CELL, DIRS } from './consts';
import { randFrom, dirIndex } from './utils';
import * as bus from './bus';

class Snake {
    constructor(head) {
        if(head) {
            this.init(head);
        }

        this.running = false;

        this.speed = 600; // ms

        bus.listen('snake-turn', (dir) => {
            this.turn(dir);
        });

        bus.listen('snake-run', () => {
            this.run();
        });

        bus.listen('snake-stop', () => {
            this.stop();
        });
    }

    init(head) {
        this.head = head;
        this.body = [this.head];

        const dir = randFrom(head.neighbors.map((x, i) => x === null ? -1 : i).filter(x => x > -1));
        this.direction = new THREE.Vector3();
        this.direction.copy(DIRS[dir]);
        const opposite = (dir + 3) % 6;
        this.body.push(head.neighbors[opposite]);

        this.body.forEach(x => x.setState(CELL.BODY));
        this.head.setState(CELL.HEAD);

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
        const dir = dirIndex(this.direction);
        const next = this.head.neighbors[dir];

        if(next.state == CELL.FOOD) {
            // grow
            this.body.push(this.body[this.body.length - 1]);
            bus.emit('ate-food', next);
        }
        if(next.state == CELL.BODY) {
            this.stop();
            bus.emit('game-over');
        }

        this.moveBody();

        const a = new THREE.Vector3();
        a.subVectors(next.mesh.position, this.head.mesh.position);
        
        this.direction.copy(next.findDir(a));
        this.head = next;
        this.body[0] = this.head;
        this.head.setState(CELL.HEAD);

        this.turned = false;
    }

    moveBody() {
        this.body[this.body.length - 1].setState(CELL.EMPTY);
        for(let i = this.body.length - 1; i > 0; i--) {
            this.body[i] = this.body[i - 1];
            this.body[i].setState(CELL.BODY);
        }
    }

    run() {
        this.running = true;

        const tick = () => {
            if(this.running) {
                this.step();
                setTimeout(tick, this.speed);
            }
        }

        tick();
    }

    stop() {
        this.running = false;
    }
}

export default Snake;