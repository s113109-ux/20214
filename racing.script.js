const gameContainer = document.getElementById('game-container');
const playerCar = document.getElementById('player-car');
const scoreDisplay = document.getElementById('score');

// Define the lanes
const lanes = [25, 125, 225, 325]; // Center positions of the 4 lanes
let currentLane = 1; // Player starts in the second lane (0-indexed)
playerCar.style.left = `${lanes[currentLane]}px`;

let score = 0;
let gameInterval;
let obstacleIntervals = []; // Array to hold all obstacle intervals

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentLane > 0) {
        currentLane--;
    }
    if (e.key === 'ArrowRight' && currentLane < lanes.length - 1) {
        currentLane++;
    }
    playerCar.style.left = `${lanes[currentLane]}px`;
});

function createObstacle() {
    const availableLanes = [0, 1, 2, 3];
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => {
        const obstacleTop = parseInt(window.getComputedStyle(obstacle).getPropertyValue('top'));
        if (obstacleTop < 150) { // Don't spawn if an obstacle is near the top
            const obstacleLane = lanes.indexOf(parseInt(window.getComputedStyle(obstacle).getPropertyValue('left')));
            const index = availableLanes.indexOf(obstacleLane);
            if (index > -1) {
                availableLanes.splice(index, 1);
            }
        }
    });

    if (availableLanes.length === 0) {
        return; // No available lanes to spawn an obstacle
    }

    const laneIndex = availableLanes[Math.floor(Math.random() * availableLanes.length)];
    const lane = lanes[laneIndex];

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');

    const type = Math.random();
    let speed;
    let obstacleWidth;

    if (type < 0.4) {
        obstacle.classList.add('oncoming-car');
        obstacleWidth = 50;
        speed = 20;
    } else if (type < 0.8) {
        obstacle.classList.add('car');
        obstacleWidth = 50;
        speed = 10;
    } else {
        obstacle.classList.add('truck');
        obstacleWidth = 70;
        speed = 5;
    }

    obstacle.style.left = `${lane - obstacleWidth / 2}px`;
    obstacle.style.top = '-150px';
    gameContainer.appendChild(obstacle);

    let obstacleInterval = setInterval(() => {
        const obstacleTop = parseInt(window.getComputedStyle(obstacle).getPropertyValue('top'));
        if (obstacleTop > gameContainer.offsetHeight) {
            obstacle.remove();
            clearInterval(obstacleInterval);
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
        } else {
            obstacle.style.top = `${obstacleTop + speed}px`;
        }

        const playerRect = playerCar.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            playerRect.bottom >= obstacleRect.top &&
            playerRect.top <= obstacleRect.bottom &&
            playerRect.right >= obstacleRect.left &&
            playerRect.left <= obstacleRect.right
        ) {
            endGame();
        }
    }, 50);
    obstacleIntervals.push(obstacleInterval);
}

const restartButton = document.getElementById('restart-button');

restartButton.addEventListener('click', () => {
    document.getElementById('game-over').style.display = 'none';
    restartButton.style.display = 'none';
    document.querySelectorAll('.obstacle').forEach(o => o.remove());
    startGame();
});

function startGame() {
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    currentLane = 1;
    playerCar.style.left = `${lanes[currentLane]}px`;
    gameInterval = setInterval(createObstacle, 1000); // Faster obstacle creation
}

function endGame() {
    clearInterval(gameInterval);
    obstacleIntervals.forEach(clearInterval);
    obstacleIntervals = [];

    document.getElementById('game-over').style.display = 'block';
    document.getElementById('restart-button').style.display = 'block';
}

startGame();