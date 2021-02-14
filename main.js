const screen = {
  width: 640,
  height: 480,
};

const playerOne = {
  width: 15,
  height: 65,
  x: 20,
  y: (screen.height - 65) / 2,
  velocity: 20,
};

const playerTwo = {
  width: 15,
  height: 65,
  x: 600,
  y: (screen.height - 65) / 2,
  velocity: 20,
};

const score = {
  playerOne: 0,
  playerTwo: 0,
};

const ball = {
  width: 10,
  height: 10,
  x: screen.width / 2,
  y: screen.height / 2,
  defaultVelocity: 1,
  velocityX: 1,
  velocityY: 1,
};

const audioController = {
  hit: new Audio('assets/hit.mp3'),
  playHit: () => {
    audioController.hit.play();
  },
};

/**
 * @param obj1
 * @param obj2
 * @returns {boolean}
 */
const isColliding = (obj1, obj2) => {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
};

const ballLogic = () => {
  if (ball.y < 0) {
    ball.velocityY = Math.abs(ball.velocityY);
  } else if (ball.y + ball.height >= screen.height) {
    ball.velocityY = -Math.abs(ball.velocityY);
  }

  if (ball.x >= screen.width) {
    ball.x = screen.width / 2;
    score.playerOne += 1;
    ball.velocityX = ball.defaultVelocity;
  } else if (ball.x <= 0) {
    ball.x = screen.width / 2;
    score.playerTwo += 1;
    ball.velocityX = -Math.abs(ball.defaultVelocity);
  }

  if (isColliding(ball, playerOne)) {
    ball.velocityX = Math.abs(ball.velocityX - ball.defaultVelocity);
    audioController.playHit();
  } else if (isColliding(ball, playerTwo)) {
    ball.velocityX = -Math.abs(ball.velocityX + ball.defaultVelocity);
    audioController.playHit();
  }

  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
};

/**
 * @param {CanvasRenderingContext2D} ctx
 */
const drawBall = (ctx) => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
};

/**
 * @param {CanvasRenderingContext2D} ctx
 */
const drawPlayerOne = (ctx) => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(playerOne.x, playerOne.y, playerOne.width, playerOne.height);
};

/**
 * @param {CanvasRenderingContext2D} ctx
 */
const drawPlayerTwo = (ctx) => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(playerTwo.x, playerTwo.y, playerTwo.width, playerTwo.height);
};

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
const drawScore = (ctx) => {
  ctx.font = '40px serif';
  ctx.fillText(score.playerOne, screen.width / 2 - 100, 80);
  ctx.fillText(score.playerTwo, screen.width / 2 + 100, 80);
};

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
const drawScenario = (ctx) => {
  ctx.setLineDash([10, 20]);
  ctx.strokeStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(screen.width / 2, 10);
  ctx.lineTo(screen.width / 2, screen.height);
  ctx.stroke();
};

/**
 * @param {CanvasRenderingContext2D} ctx
 */
const render = (ctx) => {
  drawScore(ctx);
  drawPlayerOne(ctx);
  drawPlayerTwo(ctx);
  drawBall(ctx);
  drawScenario(ctx);
};

/**
 * @param {KeyboardEvent} event
 */
const readKeyEvents = (event) => {
  switch (event.key) {
    //Player One
    case 'w':
      if (playerOne.y >= 0) {
        playerOne.y -= playerOne.velocity;
      }
      break;
    case 's':
      if (playerOne.y + playerOne.height <= screen.height) {
        playerOne.y += playerOne.velocity;
      }
      break;

    //Player Two
    case 'i':
      if (playerTwo.y > 0) {
        playerTwo.y -= playerTwo.velocity;
      }
      break;
    case 'k':
      if (playerTwo.y + playerTwo.height <= screen.height) {
        playerTwo.y += playerTwo.velocity;
      }
      break;
  }
};

const loop = () => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  //Limpa a tela
  ctx.clearRect(0, 0, screen.width, screen.height);

  ballLogic();
  render(ctx);

  window.requestAnimationFrame(loop);
};

//Eventos
document.addEventListener('DOMContentLoaded', () => {
  window.requestAnimationFrame(loop);
});

document.addEventListener('keypress', readKeyEvents);
