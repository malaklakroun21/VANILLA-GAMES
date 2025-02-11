class PongGame {
    constructor() {
        this.state = {
            gameState: 'MENU',
            ball: { x: 0, y: 0, dx: 0, dy: 0, size: 20 },
            playerPaddle: { y: 0, height: 100 },
            computerPaddle: { y: 0, height: 100 },
            scores: { player: 0, computer: 0 },
            startTime: 0,
            currentTime: 0,
            difficulty: {
                ballSpeed: 5,
                computerSpeed: 6,
                accuracy: 0.9
            }
        };

        this.elements = {
            ball: document.getElementById('game-ball'),
            playerPaddle: document.getElementById('player-paddle'),
            computerPaddle: document.getElementById('computer-paddle'),
            gameArea: document.querySelector('.game-area'),
            mainMenu: document.getElementById('main-menu'),
            gameOver: document.getElementById('game-over-screen'),
            timer: document.getElementById('game-timer'),
            playerScore: document.getElementById('player-score'),
            computerScore: document.getElementById('computer-score'),
            difficultySelect: document.getElementById('difficulty-select')
        };

        this.boundLoop = this.gameLoop.bind(this);
        this.boundHandleMove = this.handleMouseMove.bind(this);
        this.init();
    }

    init() {
        document.getElementById('start-game-button').onclick = () => this.startGame();
        document.getElementById('restart-game-button').onclick = () => this.showMenu();
        document.addEventListener('mousemove', this.boundHandleMove);
        document.addEventListener('touchmove', this.boundHandleMove, { passive: false });
        
        this.showMenu();
    }

    showMenu() {
        this.state.gameState = 'MENU';
        this.elements.mainMenu.classList.remove('hidden');
        this.elements.gameOver.classList.add('hidden');
    }

    startGame() {
        const difficulty = this.elements.difficultySelect.value;
        this.setDifficulty(difficulty);
        
        this.elements.mainMenu.classList.add('hidden');
        this.elements.gameOver.classList.add('hidden');
        
        this.state.gameState = 'PLAYING';
        this.state.startTime = Date.now();
        this.state.scores = { player: 0, computer: 0 };
        this.updateScores();
        this.resetBall();
        requestAnimationFrame(this.boundLoop);
    }

    setDifficulty(level) {
        const difficulties = {
            easy: { ballSpeed: 4, computerSpeed: 5, accuracy: 0.8 },
            medium: { ballSpeed: 5, computerSpeed: 6, accuracy: 0.9 },
            hard: { ballSpeed: 6, computerSpeed: 7, accuracy: 1.0 }
        };
        this.state.difficulty = difficulties[level];
    }

    resetBall() {
        const gameArea = this.elements.gameArea.getBoundingClientRect();
        this.state.ball = {
            x: gameArea.width / 2,
            y: gameArea.height / 2,
            dx: this.state.difficulty.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
            dy: this.state.difficulty.ballSpeed * (Math.random() * 2 - 1) * 0.5,
            size: 20
        };
    }

    handleMouseMove(e) {
        if (this.state.gameState !== 'PLAYING') return;
        e.preventDefault();
        
        const gameArea = this.elements.gameArea.getBoundingClientRect();
        const y = (e.type === 'touchmove' ? e.touches[0].clientY : e.clientY) - gameArea.top;
        
        this.state.playerPaddle.y = Math.max(0, 
            Math.min(y - this.state.playerPaddle.height / 2, 
                    gameArea.height - this.state.playerPaddle.height));
    }

    updateComputerPaddle() {
        const gameArea = this.elements.gameArea.getBoundingClientRect();
        const targetY = this.state.ball.y - this.state.computerPaddle.height / 2;
        
        if (Math.random() > this.state.difficulty.accuracy) {
            return;
        }

        const currentY = this.state.computerPaddle.y;
        const diff = targetY - currentY;
        const step = Math.sign(diff) * this.state.difficulty.computerSpeed;
        
        this.state.computerPaddle.y = Math.max(0, 
            Math.min(currentY + step, 
                    gameArea.height - this.state.computerPaddle.height));
    }

    checkCollisions() {
        const gameArea = this.elements.gameArea.getBoundingClientRect();
        const ball = this.state.ball;
        const paddleWidth = 15;

        // Wall collisions
        if (ball.y <= 0 || ball.y >= gameArea.height - ball.size) {
            ball.dy *= -1;
            ball.y = Math.max(0, Math.min(ball.y, gameArea.height - ball.size));
        }

        // Paddle collisions
        const ballCenterY = ball.y + ball.size / 2;

        // Player paddle
        if (ball.x <= paddleWidth && 
            ballCenterY >= this.state.playerPaddle.y && 
            ballCenterY <= this.state.playerPaddle.y + this.state.playerPaddle.height) {
            ball.dx = Math.abs(ball.dx);
            const hitPos = (ballCenterY - this.state.playerPaddle.y) / this.state.playerPaddle.height;
            ball.dy = (hitPos - 0.5) * this.state.difficulty.ballSpeed * 2;
        }

        // Computer paddle
        if (ball.x >= gameArea.width - paddleWidth - ball.size && 
            ballCenterY >= this.state.computerPaddle.y && 
            ballCenterY <= this.state.computerPaddle.y + this.state.computerPaddle.height) {
            ball.dx = -Math.abs(ball.dx);
            const hitPos = (ballCenterY - this.state.computerPaddle.y) / this.state.computerPaddle.height;
            ball.dy = (hitPos - 0.5) * this.state.difficulty.ballSpeed * 2;
        }

        // Scoring
        if (ball.x <= 0) {
            this.state.scores.computer++;
            this.updateScores();
            this.gameOver("Computer Wins!");
        } else if (ball.x >= gameArea.width - ball.size) {
            this.state.scores.player++;
            this.updateScores();
            this.gameOver("Player Wins!");
        }
    }

    updatePositions() {
        const gameArea = this.elements.gameArea.getBoundingClientRect();
        
        // Update ball
        this.state.ball.x += this.state.ball.dx;
        this.state.ball.y += this.state.ball.dy;
        
        // Update elements
        this.elements.ball.style.left = `${this.state.ball.x}px`;
        this.elements.ball.style.top = `${this.state.ball.y}px`;
        this.elements.playerPaddle.style.top = `${this.state.playerPaddle.y}px`;
        this.elements.computerPaddle.style.top = `${this.state.computerPaddle.y}px`;
    }

    updateScores() {
        this.elements.playerScore.textContent = `Player: ${this.state.scores.player}`;
        this.elements.computerScore.textContent = `Computer: ${this.state.scores.computer}`;
    }

    updateTimer() {
        const elapsed = Date.now() - this.state.startTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        this.elements.timer.textContent = 
            `Time: ${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    gameOver(message) {
        this.state.gameState = 'GAME_OVER';
        this.elements.gameOver.querySelector('#game-result').textContent = message;
        this.elements.gameOver.querySelector('#final-time').textContent = 
            `Time: ${this.elements.timer.textContent.slice(6)}`;
        this.elements.gameOver.classList.remove('hidden');
    }

    gameLoop() {
        if (this.state.gameState !== 'PLAYING') return;
        
        this.updateTimer();
        this.updateComputerPaddle();
        this.updatePositions();
        this.checkCollisions();
        
        requestAnimationFrame(this.boundLoop);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => new PongGame());