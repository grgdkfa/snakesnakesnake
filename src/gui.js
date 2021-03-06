import * as bus from './bus';

function turnRight() {
    bus.emit('snake-turn', 1);
}

function turnLeft() {
    bus.emit('snake-turn', -1);
}

function hide(element) {
    element.style.display = 'none';
}

function show(element) {
    element.style.display = '';
}

class GUI {
    constructor() {

        const hideButtons = (event) => {
            if(event.key == 'ArrowRight' || event.key == 'ArrowLeft') {
                this.hideButtons();
                document.removeEventListener('keydown', hideButtons);
            }
        };

        document.addEventListener('keydown', hideButtons);
        
        document.addEventListener('keydown', (event) => {
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
        });
        this.buttons.right.addEventListener("mousedown", () => {
            turnRight(); 
        });

        this.buttons.left.addEventListener("mousedown", () => {
            this.hideButtons();
        }, { once: true });
        this.buttons.right.addEventListener("mousedown", () => {
            this.hideButtons();
        }, { once: true });

        this.gameover = document.querySelector(".gameover-sign");
        this.gameover.addEventListener('click', () => {
            bus.emit('start-game');
        });
        bus.listen('game-over', () => {
            this.showGameover();
        })
    }

    hideButtons() {
        this.buttons.left.classList.add('transparent');   
        this.buttons.right.classList.add('transparent');   
    }

    showGameover() {
        document.body.classList.add('state-gameover');
    }

    clear() {
        document.body.className = '';
    }
}

export default GUI;