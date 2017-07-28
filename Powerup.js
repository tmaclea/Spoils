function Powerup(startX, startY) {
    this.pos = createVector(startX, startY);
    this.r = 10;
    this.vel = createVector(random(-7, 7), random(-7,7));
    this.friction = .8;
    this.timeAlive = 20000 + random(-1000,1000);
    this.boostTime = 5000;
    this.done = false;
    this.color = color(0);
    this.type = "error";

    this.getRandom();

    setTimeout(() => this.done = true, this.timeAlive);

}

Powerup.prototype.show = function() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
}

Powerup.prototype.update = function() {
    //constrain to edge of play area
    this.pos.y = constrain(this.pos.y, -height*2+this.r, height*2-this.r);
    this.pos.x = constrain(this.pos.x, -width*2+this.r, width*2-this.r);
    
    this.pos.add(this.vel);
    this.vel.mult(this.friction);
}

Powerup.prototype.getRandom = function() {
    var randBoost = floor(random(0,4));
    switch(randBoost) {
        case 0:
            this.type = "Agility";
            this.color = color(255,255,0);
            break;
        case 1:
            this.type = "Quick shot";
            this.color = color(200,200,175);
            break;
        case 2:
            this.type = "Invincibility";
            this.color = color(0,0,200);
            break;
        case 3:
            this.type = "Damage";
            this.color = color(255,0,0);
            break;
    }
}

Powerup.prototype.boost = function(player) {
    var orig;
    switch(this.type) {
        case "Agility":
            orig = player.vel;
            player.vel = 3.5;
            player.boosted = true;
            player.powerupText = "Active: Agility";
            setTimeout(() => { 
                player.vel = orig;
                player.boosted = false;
                player.powerupText = "";
             }, this.boostTime);
            break;
        case "Quick shot":
            orig = player.firingSpeed;
            player.firingSpeed = 1;
            player.boosted = true;
            player.powerupText = "Active: Quick shot";
            setTimeout(() => { 
                player.firingSpeed = orig; 
                player.boosted = false;
                player.powerupText = "";
            }, this.boostTime);
            break;
        case "Invincibility":
            orig = player.health;
            var origMax = player.maxHealth;
            player.health = 9999999;
            player.maxHealth = 9999999;
            player.boosted = true;
            player.powerupText = "Active: Invincibility";
            setTimeout(() => { 
                player.health = orig; 
                player.maxHealth = origMax;
                player.boosted = false;
                player.powerupText = "";
             }, this.boostTime);
            break;
        case "Damage":
            orig = player.damage;
            player.damage = 10000;
            player.boosted = true;
            player.powerupText = "Active: Damage";
            setTimeout(() => { 
                player.damage = orig;
                player.boosted = false;
                player.powerupText = "";
             },  this.boostTime);
            break;
    }
}

