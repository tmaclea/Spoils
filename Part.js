function Part(startX, startY) {
    this.pos = createVector(startX, startY);
    this.r = 5;
    this.vel = createVector(random(-5,5), random(-5,5));

    this.friction = .8;
}

Part.prototype.show = function() {
    fill(color(200,200,0));
    // ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
    rect(this.pos.x, this.pos.y, this.r*2, this.r*2);
}

Part.prototype.update = function() {
    this.pos.add(this.vel);
    this.vel.mult(this.friction);
}