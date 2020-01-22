
import * as THREE from 'three';
import Level from './level';
import Snake from './snake';
import GUI from './gui';
import * as bus from './bus';

import CAMERA_FACTOR from './consts';

class Game {
	constructor() {
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 0x343434 );
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );

		this.gui = new GUI();

		this.level = new Level();
		this.snake = new Snake();

		this.initLevel();

		bus.listen('start-game', () => {
			this.start();
		});

		this.animate();
	}

	initLevel() {
		const size = 3;
		this.level.buildCube(size);
		this.scene.add(this.level.group);

		this.light = new THREE.DirectionalLight(0xffffff, 1);
		this.light.position.z = 1;
		this.scene.add(this.light);

		this.camera.position.z = size * CAMERA_FACTOR;

		this.snake.init(this.level.randCell());
	}

	start() {
		this.level.spawnFood();
		bus.listen('ate-food', () => {
			this.level.spawnFood();
		});
		this.snake.run();
	}

	animate() {
		requestAnimationFrame(() => { this.animate() });
		this.renderer.render(this.scene, this.camera);

		// eyeballed formula
		this.alignCamera(40 / this.snake.speed);
	}

	alignCamera(dt) {
		const m = new THREE.Matrix4();
		const target = new THREE.Vector3();
		target.copy(this.snake.head.mesh.position);
		target.normalize();
		target.multiplyScalar(this.level.size * CAMERA_FACTOR);
		m.lookAt(target, new THREE.Vector3(0, 0, 0), this.snake.direction);
		m.getInverse(m);
		const q = new THREE.Quaternion();
		q.setFromRotationMatrix(m);
		this.level.group.quaternion.slerp(q, dt);
	}
}

export default Game;