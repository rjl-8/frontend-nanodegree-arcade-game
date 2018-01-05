// Various game parameters
var Game = function() {
    this.status = 'stopped';
    this.score = 0;
    this.message = '';
};

// handle starting and stopping the game
Game.prototype.toggleStart = function() {
    player.resetLoc();
    if (this.status == 'stopped') {
        this.score = 0;
        this.message = "";
        this.status = 'started';
        document.getElementById('div_start').style = 'display:none';
    }
    else {
        this.status = 'stopped';
        document.getElementById('div_start').style = 'display:block';
    }
};

// manage score
Game.prototype.changeScore = function(delta) {
    this.score = this.score + delta;
    // if won the game
    if (this.score >= 200) {
        this.toggleStart();

        // Congratulations
        this.setMessage("CONGRATULATIONS!!!");
    }

    // if negative score, lost the game
    if (this.score < 0) {
        this.score = 0;
        this.toggleStart();

        // You Lost
        this.setMessage("You Lost!!!");
    }
}

Game.prototype.setMessage = function(msg) {
    this.message = msg;
    ctx.font = "30px Arial";
    ctx.fillText(msg, 10, 125);
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // initialze the location and speed of the given enemy
    this.reset();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (game.status == 'started') {
        this.x = this.x + this.velocity * dt;
        if (this.x > 6 * 101) {
            this.reset();
        }
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset/init the location and velocity of the enemy
Enemy.prototype.reset = function() {
    this.x = -50 * Math.random();
    this.row = (Math.floor(Math.random() * 3) + 1) + 1;
    this.y = 83 * (this.row - 1) - 25;
    this.velocity = 50 + 200 * Math.random();
};

// Now write your own player class
var Player = function() {
    // reset player to starting point
    this.resetLoc();

    // default player image
    this.sprite = 'images/char-boy.png';
};

// This class requires an update(), render() and
// a handleInput() method.
Player.prototype.update = function(dt) {
    // Update location based on row and col
    this.x = (this.col - 1) * 101;
    this.y = (this.row - 1) * 83 - 15;

    // Check for collisions
    for (var i = 0; i < allEnemies.length; i++) {
        // Only if on same row
        if (allEnemies[i].row == this.row) {
            if ((this.x + 20 >= allEnemies[i].x
                 && this.x + 20 <= allEnemies[i].x + 101)
                || (this.x + 101 - 20 >= allEnemies[i].x
                 && this.x + 101 - 20 <= allEnemies[i].x + 101)) {
                // Negative impact on score
                game.changeScore(-50);

                // reset to start
                this.resetLoc();
            }
        }
    }

    // Check for water (bonus points)
    if (this.row == 1 && this.moved) {
        game.changeScore(+50);
        if (game.status == "started") {
            game.setMessage("Good Job! Keep going!");
        }
        this.resetLoc();
    }

    // Update score if dodging traffic (if actually moved)
    if (this.row >= 2 && this.row <= 4 && this.moved) {
        game.changeScore(+10);
    }

    this.moved = false;
};

// Reset/init the location and velocity of the player
Player.prototype.resetLoc = function() {
    this.row = 6;
    this.col = 3;
    this.moved = false;
}

// change the image called up for the player
Player.prototype.changeImage = function(imageName) {
    this.sprite = imageName;
}

// Process player movement between the rows and columns of the "map"
Player.prototype.handleInput = function(dir) {
    if (game.status == 'started') {
        game.message = "";
        if (dir == "left") {
            if (this.col > 1) {
                this.moved = true;
                this.col -= 1;
            }
        }
        else if (dir == "right") {
            if (this.col < 5) {
                this.moved = true;
                this.col += 1;
            }
        }
        else if (dir == "up") {
            if (this.row > 1) {
                this.moved = true;
                this.row -= 1;
            }
        }
        else if (dir == "down") {
            if (this.row < 6) {
                this.moved = true;
                this.row += 1;
            }
        }
    }
}

// actually render images on canvas
Player.prototype.render = function() {
    // draw player image
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // update score
    ctx.font = "20px Arial";
    ctx.fillText("SCORE: " + game.score + "/200", 10, 75);

    // show game message, if any
    if (game.message != "") {
        ctx.font = "30px Arial";
        ctx.fillText(game.message, 505/2-game.message.length*8, 425);
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
allEnemies = [];
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());

// Place the player object in a variable called player
player = new Player();

// Place the game object in a variable called game
game = new Game();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


