function Player() {
    this.pos = createVector(width/2, height/2);
    this.r = 16; //radius
    this.vel = 3;
    this.maxHealth = 100;
    this.health = 100;
    this.firingSpeed = 2000; //in milliseconds
    this.canShoot = true;
    this.killCount = 0;
    this.parts = 0;
    this.maxParts = 20;
    this.frameCount = 0;
    this.reloadText = ".";
}

Player.prototype.show = function() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
}

Player.prototype.move = function(dir) {
    //contrain player to edge of play area
    this.pos.y = constrain(this.pos.y, -height*2+this.r, height*2-this.r);
    this.pos.x = constrain(this.pos.x, -width*2+this.r, width*2-this.r);

    switch(dir) {
        case 'up': 
            this.pos.y -= this.vel;
            break;
        case 'left':
            this.pos.x -= this.vel;
            break;
        case 'down':
            this.pos.y += this.vel;
            break;
        case 'right':
            this.pos.x += this.vel;
            break;
        default:
            console.log("Error in player move function.");
            break;
    }
}


Player.prototype.shoot = function(pos, shootX, shootY) {
    this.canShoot = false;
    this.frameCount = 0;
    return new Bullet(pos, shootX, shootY);
}

Player.prototype.showHealth = function() {
    var posX = this.pos.x+(width/2);
    var posY = this.pos.y+(height/2);

    //establish minimum health
    if(this.health < 0) {this.health = 0;}

    push();
        noStroke();
        //health bar
        fill(255,80,80,180);
        rect(posX-width, posY-10, floor(width*(this.health/this.maxHealth)), 10);
        //parts bag
        fill(255,255,80,180);
        rect(posX-width, posY-20, floor(width*(this.parts/this.maxParts)), 10);

        if(this.parts == this.maxParts) {
            fill(0);
            textSize(12);
            text("Bag full. Hold shift to open store.", this.pos.x-60, this.pos.y + 275);
    }
    pop();
}

Player.prototype.pickUp = function(part) {
    var d = dist(this.pos.x, this.pos.y, part.pos.x, part.pos.y);
    var get = d < this.r + part.r*2 && this.parts < this.maxParts;
    if(get) {
        this.parts++;
    }
    return get;
}

Player.prototype.reload = function() {
    var posX = this.pos.x - 10;
    var posY = this.pos.y - 25;
    push();
        fill(227,0,235);
        textSize(24);
        textStyle(BOLD);
        text(this.reloadText, posX, posY);
    pop();

    if(this.frameCount % 10 == 0) {
        this.reloadText += ".";
    }
    if(this.reloadText == "....") {
        this.reloadText = ".";
    }

    this.frameCount++;
}

Player.prototype.startOver = function() {
    this.pos = createVector(width/2, height/2);
    this.vel = 3;
    this.maxHealth = 100;
    this.health = 100;
    this.firingSpeed = 2000; //in milliseconds
    this.killCount = 0;
    this.parts = 0;
}