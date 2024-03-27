const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: {
        create,
        update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

let ball;
let paddle;
let lives = 3;
let score = 0;
let livesText;
let scoreText;

const brickInfo = {
    width: 50,
    height: 20,
    count: {
        row: 4,
        col: 12
    },
    offset: {
        top: 90,
        left: 60
    },
    padding: 10,
};

let scene;

const randomBricks = getRandomInt(0, brickInfo.count.row * brickInfo.count.col - 1, 10);
console.log(randomBricks);

function getRandomInt(min, max, noOfNumbers) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const numbers = [];

    for (let i = 0; i < noOfNumbers; i++) {
        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    return numbers;
}

function create() {
    scene = this;

    paddle = scene.add.rectangle(400, 570, 140, 10, 0xFFFFFF);
    ball = scene.add.circle(400, 300, 10, 0xFFFFFF);
    const lava = scene.add.rectangle(0, 600, 200000, 10, 0xFF0000);
    scoreText = scene.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#FFFFFF' });
    livesText = scene.add.text(600, 16, 'Lives: ' + lives, { fontSize: '32px', fill: '#FFFFFF' });

    scene.physics.add.existing(ball);
    scene.physics.add.existing(paddle);
    scene.physics.add.existing(lava);

    ball.body.setVelocity(250, 250);
    ball.body.setCollideWorldBounds(true);
    ball.body.setBounce(1, 1);

    paddle.body.setImmovable(true);
    lava.body.setImmovable(true);

    scene.physics.add.collider(paddle, ball, bounceOffPaddle);
    scene.physics.add.collider(ball, lava, hitLava);

    scene.input.on('pointermove', pointer => paddle.setPosition(pointer.x, paddle.y));

    createBricks();
}

function update() {
    if (lives === 0 || score === brickInfo.count.row * brickInfo.count.col) {
        location.reload();
    }
}

function bounceOffPaddle() {
    ball.body.velocity.x = -5 * (paddle.x - ball.x);
}

function createBricks() {
    for (let c = 0; c < brickInfo.count.col; c++) {
        for (let r = 0; r < brickInfo.count.row; r++) {
            const brickX = (c * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
            const brickY = (r * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
            const brickIdx = r * brickInfo.count.col + c;
            const brickColor = randomBricks.includes(brickIdx) ? 0x00FF00 : 0xFF0000;

            const brick = scene.physics.add.existing(scene.add.rectangle(brickX, brickY, brickInfo.width, brickInfo.height, brickColor));
            brickHandler(brick);
        }
    }
}

function brickHandler(brick) { 
    brick.body.setImmovable(true);
    scene.physics.add.collider(ball, brick, () => ballHitBrick(brick));
}

function ballHitBrick(brick) {
    brick.destroy();
    score++;
    scoreText.setText("Score: " + score);
}

function hitLava() {
    console.log('Lava was hit');
    lives--;
    livesText.setText("Lives: " + lives);
}
