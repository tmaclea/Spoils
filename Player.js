function Player() {
    this.pos = createVector(width/2, height/2);
    this.r = 16; //radius
    this.vel = 3;
    this.maxHealth = 100;
    this.health = 100;
    this.firingSpeed = 20; //in milliseconds
    this.canShoot = true;
    this.killCount = 0;
}

Player.prototype.show = function() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
}

Player.prototype.move = function(dir) {
    //contrain player to edge of play area
    this.pos.y = constrain(this.pos.y, -height*2, height*2);
    this.pos.x = constrain(this.pos.x, -width*2, width*2);

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
    return new Bullet(pos, shootX, shootY);
}

Player.prototype.showHealth = function() {
    var posX = this.pos.x+(width/2)-150;
    var posY = this.pos.y+(height/2)-20;
    var healthBarLen = 110;
    push();
        fill(0);
        text("HP: ", posX, posY);
        fill(255);
        rect(posX+25, posY-15, healthBarLen, 20);
        fill(255,0,0);
        rect(posX+25, posY-15, floor(healthBarLen*(this.health/this.maxHealth)), 20);
    pop();
}

Player.prototype.startOver = function() {
    this.pos = createVector(width/2, height/2);
    this.vel = 3;
    this.maxHealth = 100;
    this.health = 100;
    this.firingSpeed = 2000; //in milliseconds
    this.killCount = 0;
}