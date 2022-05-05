var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: {
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0},
            debug: false
        }
    }
}

var game = new Phaser.Game(config);
var ball;
var paddle;
var lives = 3;
var score = 0;
var livesText;
var scoreText;
var brickInfo = {
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
}
var scene;
var randomBricks = getRandomInt(0, brickInfo.count.row * brickInfo.count.col, 10);
console.log(randomBricks);

function getRandomInt(min, max, noOfNumbers) {

    min = Math.ceil(min);
    max = Math.floor(max);
    let numbers = [];

    for (var i = 0; i < noOfNumbers; i++) {
        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    return numbers
}

function create() {

    scene = this;

    paddle = scene.add.rectangle(400, 570, 140, 10, 0xFFFFFF);
    ball = scene.add.circle(400, 300, 10, 0xFFFFFF);
    lava = scene.add.rectangle(0, 600, 200000, 10, 0xFF0000);
    scoreText = scene.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#FFFFFF' });
    livesText = scene.add.text(600, 16, 'Lives: ' + lives, { fontSize: '32px', fill: '#FFFFFF' });

    scene.physics.add.existing(ball);
    scene.physics.add.existing(paddle);
    scene.physics.add.existing(lava);

    ball.body.velocity.x = 250;
    ball.body.velocity.y = 250;
    ball.body.collideWorldBounds = true;
    ball.body.bounce.y = 1;
    ball.body.bounce.x = 1;

    paddle.body.immovable = true;

    lava.body.immovable = true;

    scene.physics.add.collider(paddle, ball, bounceOfPaddle);

    createBricks();

    scene.physics.add.collider(ball, lava, hitLava);

    scene.input.on('pointermove', function (pointer) {
        paddle.setPosition(pointer.x, paddle.y);
    });
}

function update() {
    if (lives === 0) {
        location.reload();
    }
    if (score === brickInfo.count.row * brickInfo.count.col) {
        location.reload();
    }
}

function bounceOfPaddle() {
    ball.body.velocity.x = -1 * 5 * (paddle.x - ball.x);
}

function createBricks() {
    for (c = 0; c < brickInfo.count.col; c++) {
        for (r = 0; r < brickInfo.count.row; r++) {

            var brickX = (c * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
            var brickY = (r * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
            let brickIdx = r * 10 + c;
            let brickColor =  0xFF0000;

            if (randomBricks.includes(brickIdx)) {
                brickColor = 0x00FF00;
            }

            brickHandler(scene.physics.add.existing(scene.add.rectangle(brickX, brickY, brickInfo.width, brickInfo.height, brickColor)));

        }
    }
}

function brickHandler(brick) { 
    brick.body.immovable = true;
    scene.physics.add.collider(ball, brick, function () {
        ballHitBrick(brick);
    });
}

function ballHitBrick(brick) {
    brick.destroy();
    score++;
    scoreText.setText("Score: " + score);
}

function hitLava() {
    console.log('lava was hit');
    lives--;
    livesText.setText("Lives: " + lives);
}