// pong.js

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;
document.body.appendChild(canvas);

// Game variables
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height / 2;
let dx = 2;
let dy = 2;
let paddleWidth = 10;
let paddleHeight = 75;
let playerY = (canvas.height - paddleHeight) / 2;
let computerY = (canvas.height - paddleHeight) / 2;
let playerScore = 0;
let computerScore = 0;

// Control
document.addEventListener('mousemove', (event) => {
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    playerY = mouseY - paddleHeight / 2;
});

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(x, y) {
    ctx.beginPath();
    ctx.rect(x, y, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawScores() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Player: ' + playerScore, 8, 20);
    ctx.fillText('Computer: ' + computerScore, canvas.width - 100, 20);
}

function collisionDetection() {
    if (x + ballRadius > canvas.width - paddleWidth) {
        if (y > computerY && y < computerY + paddleHeight) {
            dx = -dx;
        } else {
            playerScore++;
            resetBall();
        }
    } else if (x - ballRadius < paddleWidth) {
        if (y > playerY && y < playerY + paddleHeight) {
            dx = -dx;
        } else {
            computerScore++;
            resetBall();
        }
    }
}

function resetBall() {
    x = canvas.width / 2;
    y = canvas.height / 2;
    dx = 2;
    dy = 2;
}

function update() {
    x += dx;
    y += dy;

    if (y + ballRadius > canvas.height || y - ballRadius < 0) {
        dy = -dy;
    }

    // Computer paddle AI
    if (computerY + paddleHeight / 2 < y) {
        computerY += 4;
    } else {
        computerY -= 4;
    }

    collisionDetection();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle(0, playerY);
    drawPaddle(canvas.width - paddleWidth, computerY);
    drawScores();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();