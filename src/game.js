
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

		this.animate();
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

	animate() {
		requestAnimationFrame(() => { this.animate() });
		this.renderer.render(this.scene, this.camera);

		/*this.level.group.rotation.x -= 0.005;
		this.level.group.rotation.z += 0.007;*/
		this.alignCamera(0.05);
	}

	alignCamera(dt) {
		const target = new THREE.Vector3();
		//this.snake.head.mesh.getWorldPosition(target);
		target.copy(this.snake.head.mesh.position);
		target.normalize();
		const q1 = new THREE.Quaternion();
		q1.setFromUnitVectors(target, new THREE.Vector3(0, 0, 1));
		const up = this.level.group.localToWorld(this.snake.direction);
		this.level.group.quaternion.slerp(q1, dt);
	}
}

export default Game;