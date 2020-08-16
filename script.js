let player = {
    x: 50,
    y: 100,
    pacMouth: 320,
    pacDir: 0,
    psize: 32,
    speed: 5
};

let enemy = {
    x: 150,
    y: 200,
    ghostNum: 0,
    speed: 5,
    moving: 0,
    dirx: 0,
    diry: 0,
    ghostEat: false,
    flash: 0
};

let enemy2 = {
    x: 150,
    y: 200,
    ghostNum: 0,
    speed: 5,
    moving: 0,
    dirx: 0,
    diry: 0,
    ghostEat: false,
    flash: 0
};

let powerPill = {
    x: 10,
    y: 10,
    powerUp: false,
    pCountDown: 0,
    ghostNum: 0,
    ghostNum2: 0
};

let pScore = 0,
    gScore = 0,
    countBlink = 10,
    ghost = false,
    ghost2 = false;

let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

document.body.appendChild(canvas);

mainImage = new Image();
mainImage.ready = false;
mainImage.onload = checkReady;
mainImage.src = "pac.png";

let keyclick = {};
document.addEventListener("keydown", function(event) {
    keyclick[event.keyCode] = true;
    move(keyclick);
}, false);

document.addEventListener("keyup", function(event) {
    delete keyclick[event.keyCode];
}, false);

function move(key) {
    // Movement around the screen
    if (37 in key) {
        // Left Arrow is clicked
        player.x -= player.speed;
        player.pacDir = 64;
    }
    if (38 in key) {
        // Up Arrow is clicked
        player.y -= player.speed;
        player.pacDir = 96;
    }
    if (39 in key) {
        // Right Arrow is clicked
        player.x += player.speed;
        player.pacDir = 0;
    }
    if (40 in key) {
        // Down Arrow is clicked
        player.y += player.speed;
        player.pacDir = 32;
    }

    // Pacman stays within the canvas
    if (player.x >= (canvas.width - 32)) {
        player.x = 0;
    }
    if (player.y >= (canvas.height - 32)) {
        player.y = 0;
    }
    if (player.x < 0) {
        player.x = canvas.width - 32;
    }
    if (player.y < 0) {
        player.y = canvas.height - 32;
    }

    if (player.pacMouth === 320) {
        player.pacMouth = 352;
    } else {
        player.pacMouth = 320;
    }
    render();
}

function checkReady() {
    this.ready = true;
    playGame();
}

function playGame() {
    render();
    requestAnimationFrame(playGame);
}

function myNum(n) {
    return Math.floor(Math.random() * n);
}

function render() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (!powerPill.powerUp && powerPill.pCountDown < 5) {
        powerPill.x = myNum(420) + 30;
        powerPill.y = myNum(250) + 30;
        powerPill.powerUp = true;
    }

    if (!ghost) {
        enemy.ghostNum = myNum(5) * 64;
        enemy.x = myNum(450);
        enemy.y = myNum(250) + 30;
        ghost = true;
    }

    if (!ghost2) {
        enemy2.ghostNum = myNum(5) * 64;
        enemy2.x = myNum(450);
        enemy2.y = myNum(250) + 30;
        ghost2 = true;
    }

    // Ghost 1 movements
    if (enemy.moving < 0) {
        enemy.moving = (myNum(20) * 3) + myNum(1);
        enemy.speed = myNum(2) + 1;
        enemy.dirx = 0;
        enemy.diry = 0;

        if (powerPill.ghostEat) {
            enemy.speed = enemy.speed * -1;
        }

        if (enemy.moving % 2) {
            if (player.x < enemy.x)
                enemy.dirx = -enemy.speed;
            else
                enemy.dirx = enemy.speed;
        } else {
            if (player.y < enemy.y)
                enemy.diry = -enemy.speed;
            else
                enemy.diry = enemy.speed;
        }
    }

    enemy.moving--;
    enemy.x = enemy.x + enemy.dirx;
    enemy.y = enemy.y + enemy.diry;

    if (enemy.x >= (canvas.width - 32)) { enemy.x = 0; }
    if (enemy.y >= (canvas.height - 32)) { enemy.y = 0; }
    if (enemy.x < 0) { enemy.x = canvas.width - 32; }
    if (enemy.y < 0) { enemy.y = canvas.height - 32; }

    // Ghost 2 movement
    if (enemy2.moving < 0) {
        enemy2.moving = (myNum(20) * 3) + myNum(1);
        enemy2.speed = myNum(2) + 1;
        enemy2.dirx = 0;
        enemy2.diry = 0;

        if (powerPill.ghostEat) {
            enemy2.speed = enemy2.speed * -1;
        }

        if (enemy2.moving % 2) {
            if (player.x < enemy2.x)
                enemy2.dirx = -enemy2.speed;
            else
                enemy2.dirx = enemy2.speed;
        } else {
            if (player.y < enemy2.y)
                enemy2.diry = -enemy2.speed;
            else
                enemy2.diry = enemy2.speed;
        }
    }

    enemy2.moving--;
    enemy2.x = enemy2.x + enemy2.dirx;
    enemy2.y = enemy2.y + enemy2.diry;

    if (enemy2.x >= (canvas.width - 32)) { enemy2.x = 0; }
    if (enemy2.y >= (canvas.height - 32)) { enemy2.y = 0; }
    if (enemy2.x < 0) { enemy2.x = canvas.width - 32; }
    if (enemy2.y < 0) { enemy2.y = canvas.height - 32; }

    // Collision detection for Ghost 1
    if (player.x <= (enemy.x + 26) && enemy.x <= (player.x + 32) && player.y <= (enemy.y + 26) &&
        enemy.y <= (player.y + 32)) {
        if (powerPill.ghostEat) {
            pScore++;
        } else {
            gScore++;
        }

        player.x = 10;
        player.y = 100;
        enemy.x = 300;
        enemy.y = 200;
        powerPill.pCountDown = 0;
    }

    // Collision detection for Ghost 2
    if (player.x <= (enemy2.x + 26) && enemy2.x <= (player.x + 32) && player.y <= (enemy2.y + 26) &&
        enemy2.y <= (player.y + 32)) {
        if (powerPill.ghostEat) {
            pScore++;
        } else {
            gScore++;
        }

        player.x = 10;
        player.y = 100;
        enemy2.x = 300;
        enemy2.y = 200;
        powerPill.pCountDown = 0;
    }

    // Collision detection for Power-Up
    if (player.x <= powerPill.x && powerPill.x <= (player.x + 32) && player.y <= powerPill.y &&
        powerPill.y <= (player.y + 32)) {
        powerPill.powerUp = false;
        powerPill.pCountDown = 500;
        powerPill.ghostNum = enemy.ghostNum;
        powerPill.ghostNum2 = enemy2.ghostNum;
        enemy.ghostNum = 384;
        enemy2.ghostNum = 384;
        powerPill.x = 0;
        powerPill.y = 0;
        powerPill.ghostEat = true;
        player.speed = 10;
    }

    if (powerPill.ghostEat) {
        powerPill.pCountDown--;
        if (powerPill.pCountDown <= 0) {
            powerPill.ghostEat = false;
            enemy.ghostNum = powerPill.ghostNum;
            enemy2.ghostNum = powerPill.ghostNum2;
            player.speed = 5;
        }
    }

    if (powerPill.powerUp) {
        context.fillStyle = "white";
        context.beginPath();
        context.arc(powerPill.x, powerPill.y, 10, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
    }

    // Enemy flashing
    if (countBlink > 0) {
        countBlink--;
    } else {
        countBlink = 20;
        if (enemy.flash === 0) {
            enemy.flash = 32;
            enemy2.flash = 32;
        } else {
            enemy.flash = 0;
            enemy2.flash = 0;
        }
    }

    context.font = "20px Verdana";
    context.fillStyle = "White";
    context.fillText("Pacman: " + pScore + " vs Ghost: " + gScore, 2, 18);
    context.drawImage(mainImage, enemy.ghostNum, enemy.flash, 32, 32, enemy.x, enemy.y, 32, 32);
    context.drawImage(mainImage, enemy2.ghostNum, enemy2.flash, 32, 32, enemy2.x, enemy2.y, 32, 32);
    context.drawImage(mainImage, player.pacMouth, player.pacDir, 32, 32, player.x, player.y, player.psize, player.psize);
}