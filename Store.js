function Store() {

}

Store.prototype.open = function(playerPos) {
    noLoop();
    push();
        translate(playerPos.x-width/2, playerPos.y-height/2);
        fill(100,100,255);
        noStroke();
        rect(0,0,width,height);
    pop();
}

Store.prototype.close = function() {
    loop();
}