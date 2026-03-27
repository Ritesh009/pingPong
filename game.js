// game.js - Ping Pong Game

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Variables
let ballRadius = 8;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballDX = 3;
let ballDY = 3;
let paddleWidth = 12;
let paddleHeight = 80;
let playerY = (canvas.height - paddleHeight) / 2;
let computerY = (canvas.height - paddleHeight) / 2;
let playerScore = 0;
let computerScore = 0;

// Keyboard input
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse control
document.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = event.clientY - rect.top;
    playerY = Math.max(0, Math.min(mouseY - paddleHeight / 2, canvas.height - paddleHeight));
});

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(x, y, isPlayer) {
    ctx.fillStyle = isPlayer ? '#00FF88' : '#FF006E';
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function updateScores() {
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
}

function collisionDetection() {
    // Right paddle (computer)
    if (ballX + ballRadius > canvas.width - paddleWidth) {
        if (ballY > computerY && ballY < computerY + paddleHeight) {
            ballDX = -ballDX * 1.05;
            ballX = canvas.width - paddleWidth - ballRadius;
            ballDY += (ballY - (computerY + paddleHeight / 2)) * 0.05;
        } else if (ballX + ballRadius > canvas.width) {
            playerScore++;
            updateScores();
            resetBall();
        }
    }

    // Left paddle (player)
    if (ballX - ballRadius < paddleWidth) {
        if (ballY > playerY && ballY < playerY + paddleHeight) {
            ballDX = -ballDX * 1.05;
            ballX = paddleWidth + ballRadius;
            ballDY += (ballY - (playerY + paddleHeight / 2)) * 0.05;
        } else if (ballX - ballRadius < 0) {
            computerScore++;
            updateScores();
            resetBall();
        }
    }

    // Top and bottom walls
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballDY = -ballDY;
        ballY = Math.max(ballRadius, Math.min(canvas.height - ballRadius, ballY));
    }

    // Speed cap
    const maxSpeed = 8;
    if (Math.abs(ballDX) > maxSpeed) ballDX = (ballDX > 0 ? 1 : -1) * maxSpeed;
    if (Math.abs(ballDY) > maxSpeed) ballDY = (ballDY > 0 ? 1 : -1) * maxSpeed;
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballDX = (Math.random() > 0.5 ? 1 : -1) * 3;
    ballDY = (Math.random() > 0.5 ? 1 : -1) * 3;
}

function update() {
    // Player paddle control
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        playerY = Math.max(0, playerY - 6);
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        playerY = Math.min(canvas.height - paddleHeight, playerY + 6);
    }

    // Ball movement
    ballX += ballDX;
    ballY += ballDY;

    // Computer AI
    const computerCenter = computerY + paddleHeight / 2;
    if (computerCenter < ballY - 35) {
        computerY = Math.min(canvas.height - paddleHeight, computerY + 4);
    } else if (computerCenter > ballY + 35) {
        computerY = Math.max(0, computerY - 4);
    }

    collisionDetection();
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
drawCenterLine();
    drawBall();
    drawPaddle(0, playerY, true);
    drawPaddle(canvas.width - paddleWidth, computerY, false);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
updateScores();
gameLoop();