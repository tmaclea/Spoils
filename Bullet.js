function Bullet(playerPos, mX, mY) {
    this.pos = createVector(playerPos.x, playerPos.y);
    // mouse position is on canvas, so math must be done to get position on game area
    this.mouse = createVector(mX+playerPos.x-(width/2), mY+playerPos.y-(height/2)); 
    this.vel = this.mouse.sub(this.pos);
    this.vel.setMag(20);
}

Bullet.prototype.fire = function() {
    this.pos.add(this.vel);
}

Bullet.prototype.render = function() {
    push();
    stroke(30);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    pop();
}

Bullet.prototype.hits = function(zombie) {
    // find distance between bullet and zombie
    var d = dist(this.pos.x, this.pos.y, zombie.pos.x, zombie.pos.y);
    // check if bullet distance is less than the radius of the zombie
    return d < zombie.r;
}

//improve later
Bullet.prototype.offscreen = function() {
    var off = false;
    this.pos.x > 7500 || this.pos.x < -7500 ? off = true : off = false;
    this.pos.y > 7500 || this.pos.y < -7500 ? off = true : off = false;
    return off;
}