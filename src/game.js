
import * as THREE from 'three';

class Game {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );

		this.initExample();

		this.animate();
	}

	initExample() {
		const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		this.cube = new THREE.Mesh( geometry, material );
		this.scene.add( this.cube );

		this.camera.position.z = 5;
	}

	animate() {
		requestAnimationFrame(() => { this.animate() });
		this.renderer.render(this.scene, this.camera);

		this.cube.rotation.x += 0.01;
		this.cube.rotation.z += 0.02;
	}
}

export default Game;