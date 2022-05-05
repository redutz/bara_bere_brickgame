var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
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
    width: 4,
    height: 4,
    count: {
        row: 26,
        col: 73
    },
    offset: {
        top: 90,
        left: 5
    },
    padding: 7,
}
var scene;

function preload() {
this.load.video('bara', 'barabere.mp4');
this.load.image('pl','PNG_transparency_demonstration_1.png');
}

function getRandomInt(min, max, noOfNumbers) {

    min = Math.ceil(min);
    max = Math.floor(max);
    let numbers = [];

    for (var i = 0; i < noOfNumbers; i++) {
        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    return numbers
}

var imigi;
function create() {

    scene = this;
    var video = this.add.video(300,100, 'bara');
    video.play();
    var s = this.add.sprite(300,100,'pl');
    paddle = scene.add.rectangle(400, 570, 140, 10, 0xFFFFFF);
    ball = scene.add.circle(400, 500, 5, 0xFFFFFF);
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
       // location.reload();
    }
    if (score === brickInfo.count.row * brickInfo.count.col) {
       // location.reload();
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
            var randomBricks = getRandomInt(0, brickInfo.count.row * brickInfo.count.col, 700);
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