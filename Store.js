function Store() {
    this.title = "This is the store"
    this.info = "Use arrow keys to make a selection and press enter to buy";
    this.barLength = 200;
    this.helpText = "";
    this.helpTime = 2000;
}

Store.prototype.upgrades = 
{    
    "item": [
    {
        "name": "vel",
        "text": "Walking speed",
        "selected": true,
        "hasProgress": true,
        "posX": 50,
        "posY": 150,
        "minVal": 1,
        "maxVal": 5,
        "cost": 10
    },
    {
        "name": "firingSpeed",
        "text": "Shooting speed",
        "selected": false,
        "hasProgress": true,
        "posX": 50,
        "posY": 225,
        "minVal": 2000,
        "maxVal": 1,
        "cost": 10
    },
    {
        "name": "maxHealth",
        "text": "Maximum health",
        "selected": false,
        "hasProgress": true,
        "posX": 50,
        "posY": 300,
        "minVal": 100,
        "maxVal": 10000,
        "cost": 10
    },
    {
        "name": "maxParts",
        "text": "Parts bag capacity",
        "selected": false,
        "hasProgress": true,
        "posX": 50,
        "posY": 375,
        "minVal": 25,
        "maxVal": 10000,
        "cost": 25
    },
    {
        "name": "damage",
        "text": "Bullet damage",
        "selected": false,
        "hasProgress": true,
        "posX": 50,
        "posY": 450,
        "minVal": 25,
        "maxVal": 10000,
        "cost": 10
    },
    {
        "name": "health",
        "text": "Heal",
        "selected": false,
        "posX": 50,
        "posY": 525,
        "cost": 10
    }
    ]
}

Store.prototype.open = function(player) {
    noLoop();
    var barYoffset = 20;
    var progress = 0;
    push();
        translate(player.pos.x-width/2, player.pos.y-height/2);
        //background
        fill(165,42,42);
        noStroke();
        rect(0,0,width,height);
        //Title, info, helptext
        fill(0);
        textSize(24);
        text(this.title, 220, 50);
        textSize(12);
        text(this.info, 150, 75);
        textSize(14);
        textStyle(BOLD);
        fill(255,100,100);
        text(this.helpText, 220, 110);
        textSize(18);
        //selections
        for(var i = 0; i < this.upgrades.item.length; i++){
            var item = this.upgrades.item[i];
            if(item.selected) {
                fill(0,255,0);
            } else {
                fill(255);
            }
            text(item.text, item.posX, item.posY);
            //upgrade bars
            fill(255);
            rect(item.posX, item.posY + barYoffset, this.barLength, 10, 5);
            fill(138,43,226);
            rect(item.posX, item.posY + barYoffset, floor(this.barLength*(this.getUpgradeProgress(item, player))), 10, 5);
        }
    pop();
}

Store.prototype.moveSelection = function(key, player) {
    var selectedIndex;
    var numItems = 0;
    this.helpText = "";
    for(var i = 0; i < this.upgrades.item.length; i++) {
        if(this.upgrades.item[i].selected) {
            selectedIndex = i;
            this.upgrades.item[i].selected = false;
        }
        numItems++;
    }

    if(key === UP_ARROW || key === 87) {
        selectedIndex--;
        if(selectedIndex < 0) {selectedIndex = numItems - 1;}
    }
    if(key === DOWN_ARROW || key === 83) {
        selectedIndex++;
        if(selectedIndex > numItems - 1) {selectedIndex = 0;}
    }

    this.upgrades.item[selectedIndex].selected = true;
    this.open(player);
}

Store.prototype.getUpgradeProgress = function(item, player) {
    var progress = 0;
    switch(item.name) {
        case "vel":
            progress = (player.vel - item.minVal) / item.maxVal;
            break;
        case "maxHealth":
            progress = (player.maxHealth - item.minVal) / item.maxVal;
            break;
        case "maxParts":
            progress = (player.maxParts - item.minVal) / item.maxVal;
            break;
        case "firingSpeed":
            progress = (item.minVal - player.firingSpeed) / (item.minVal - item.maxVal);
            break;
        case "damage":
            progress = (player.damage - item.minVal) / item.maxVal;
            break;
        case "health":
            progress = (player.health / player.maxHealth);
            break;
        default:
            break;
    }

    return progress;
}

Store.prototype.buy = function(player) {
    var item;
    for(var i = 0; i < this.upgrades.item.length; i++) {
        if(this.upgrades.item[i].selected) {
            item = this.upgrades.item[i];
        }
    }

    if(player.parts < item.cost) {
        this.helpText = "You cannot afford this.";
    } else {
        player.parts -= item.cost;
        switch(item.name) {
            case "vel":
                player.vel += 0.1
                break;
            case "maxHealth":
                player.maxHealth += 50;
                break;
            case "maxParts":
                player.maxParts += 25;
                break;
            case "firingSpeed":
                player.firingSpeed -= 100;
                break;
            case "damage":
                player.damage += 25;
                break;
            case "health":
                player.health += 10;
                break;
            default:
                break;
        }
    }



    this.open(player);
}

Store.prototype.close = function() {
    this.helpText = "";
    //reset selection to first item
    for(var i = 0; i < this.upgrades.item.length; i++) {
        if(this.upgrades.item[i].selected) {
            this.upgrades.item[i].selected = false;
        }
    }
    this.upgrades.item[0].selected = true;
    loop();
}