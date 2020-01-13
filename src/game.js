
import * as THREE from 'three';
import Level from './level';
import Snake from './snake';

class Game {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );

		this.level = new Level();
		this.snake = new Snake();

		this.initLevel();

		document.addEventListener('keydown', (event) => {
			console.log(event);
			if(event.key == 'ArrowRight') {
				this.snake.turn(1);
			}
			if(event.key == 'ArrowLeft') {
				this.snake.turn(-1);
			}
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
		this.level.buildCube(3,4,5);
		this.scene.add(this.level.group);

		this.light = new THREE.DirectionalLight(0xffffff, 1);
		this.light.position.z = 8;
		this.scene.add(this.light);

		this.camera.position.z = 8;

		this.snake.init(this.level.randCell());

		
	}

	start() {
		this.animate();

		setInterval(() => {
			this.snake.step();
		}, this.snake.speed);
	}

	animate() {
		requestAnimationFrame(() => { this.animate() });
		this.renderer.render(this.scene, this.camera);

		this.alignCamera(0.05);
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