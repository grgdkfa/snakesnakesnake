import * as bus from './bus';

function turnRight() {
    bus.emit('snake-turn', 1);
}

function turnLeft() {
    bus.emit('snake-turn', -1);
}

class GUI {
    constructor() {
        
        document.addEventListener('keydown', (event) => {
			console.log(event);
			if(event.key == 'ArrowRight') {
				turnRight();
			}
			if(event.key == 'ArrowLeft') {
				turnLeft();
			}
        });
        
        this.buttons = {};

        this.buttons.left = document.querySelector(".dir-button.left");
        this.buttons.right = document.querySelector(".dir-button.right");

        this.buttons.left.addEventListener("mousedown", () => {
            turnLeft();
            this.hideButtons();   
        });
        this.buttons.right.addEventListener("mousedown", () => {
            turnRight();
            this.hideButtons();   
        });
    }

    hideButtons() {
        this.buttons.left.classList.add('transparent');   
        this.buttons.right.classList.add('transparent');   
    }
}

export default GUI;