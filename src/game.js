
import * as THREE from 'three';
import Level from './level';
import Snake from './snake';
import GUI from './gui';
import * as bus from './bus';

class Game {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );

		this.gui = new GUI();

		this.level = new Level();
		this.snake = new Snake();

		this.initLevel();

		this.animate();

		bus.listen('start-game', () => {
			this.start();
		});

		this.start();
	}

	initExample() {
		const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		this.cube = new THREE.Mesh( geometry, material );
		this.scene.add( this.cube );

		this.camera.position.z = 5;
	}

	initLevel() {
		this.level.buildCube(5);
		this.scene.add(this.level.group);

		this.light = new THREE.DirectionalLight(0xffffff, 1);
		this.light.position.z = 8;
		this.scene.add(this.light);

		this.camera.position.z = 8;

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
		target.multiplyScalar(8);
		m.lookAt(target, new THREE.Vector3(0, 0, 0), this.snake.direction);
		m.getInverse(m);
		const q = new THREE.Quaternion();
		q.setFromRotationMatrix(m);
		this.level.group.quaternion.slerp(q, dt);
	}
}

export default Game;