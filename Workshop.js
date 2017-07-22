function Workshop() {
    this.title = "This is the workshop"
    this.info = "Use arrow keys to make a selection and press enter to buy";
    this.barLength = 200;
    this.helpText = "";
    this.helpTime = 2000;
}

Workshop.prototype.upgrades = 
{    
    "item": [
    {
        "name": "vel",
        "text": "Upgrade exoskeleton",
        "selected": true,
        "hasProgress": true,
        "posX": 50,
        "posY": 125,
        "minVal": 1,
        "maxVal": 5,
        "cost": 10
    },
    {
        "name": "firingSpeed",
        "text": "Improve gun",
        "selected": false,
        "hasProgress": true,
        "posX": 50,
        "posY": 200,
        "minVal": 2100,
        "maxVal": 70,
        "cost": 10
    },
    {
        "name": "maxHealth",
        "text": "Enhance Armor",
        "selected": false,
        "hasProgress": true,
        "posX": 50,
        "posY": 275,
        "minVal": 100,
        "maxVal": 1000,
        "cost": 10
    },
    {
        "name": "maxParts",
        "text": "Build a bigger bag",
        "selected": false,
        "hasProgress": true,
        "posX": 50,
        "posY": 350,
        "minVal": 25,
        "maxVal": 3200,
        "cost": 25
    },
    {
        "name": "damage",
        "text": "Modify bullets",
        "selected": false,
        "hasProgress": true,
        "posX": 50,
        "posY": 425,
        "minVal": 100,
        "maxVal": 1000,
        "cost": 10
    },
    {
        "name": "health",
        "text": "Heal",
        "selected": false,
        "posX": 50,
        "posY": 500,
        "cost": 10
    }
    ]
}

Workshop.prototype.open = function(player) {
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
        text(this.title, 200, 50);
        textSize(12);
        text(this.info, 150, 75);
        textSize(14);
        textStyle(BOLD);
        fill(255,100,100);
        text(this.helpText, 230, 95);
        textSize(18);
        fill(255,255,0);
        rect(440, 570, 170, 30, 10);
        fill(0);
        text("Bag: " + player.parts + " parts", 450,590);
        //selections
        for(var i = 0; i < this.upgrades.item.length; i++){
            var item = this.upgrades.item[i];
            if(item.selected) {
                fill(0,255,0);
            } else {
                fill(255);
            }
            text(item.text, item.posX, item.posY);
            //only show cost if the item isnt fully upgraded
            if(this.getUpgradeProgress(item, player) < 1) {
                fill(0);
                text("Cost: " + item.cost + " parts", item.posX+400, item.posY);
            }
            //upgrade bars
            fill(255);
            rect(item.posX, item.posY + barYoffset, this.barLength, 10, 5);
            fill(138,43,226);
            rect(item.posX, item.posY + barYoffset, floor(this.barLength*(this.getUpgradeProgress(item, player))), 10, 5);
        }
    pop();
}

Workshop.prototype.moveSelection = function(key, player) {
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

Workshop.prototype.getUpgradeProgress = function(item, player) {
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

Workshop.prototype.buy = function(player) {
    var item;
    for(var i = 0; i < this.upgrades.item.length; i++) {
        if(this.upgrades.item[i].selected) {
            item = this.upgrades.item[i];
        }
    }
    if(this.getUpgradeProgress(item, player) >= 1) {
        this.helpText = "Item fully upgraded.";
    } else if(player.parts < item.cost) {
        this.helpText = "You cannot afford this.";
    } else {
        player.parts -= item.cost;
        player.numUpgrades++;
        switch(item.name) {
            case "vel":
                player.vel += 0.1
                item.cost = floor(item.cost * 1.5);
                break;
            case "maxHealth":
                player.maxHealth += 50;
                item.cost = floor(item.cost * 1.8);
                this.upgrades.item[5].cost = floor(this.upgrades.item[5].cost * 1.4); //item 5 = health
                break;
            case "maxParts":
                player.maxParts *= 2;
                item.cost = player.maxParts;
                break;
            case "firingSpeed":
                player.firingSpeed -= 100;
                item.cost = floor(item.cost * 1.5);
                break;
            case "damage":
                player.damage += 25;
                item.cost = floor(item.cost * 1.5);
                break;
            case "health":
                player.health += player.maxHealth * .25;
                break;
            default:
                break;
        }
    }



    this.open(player);
}

Workshop.prototype.close = function() {
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

Workshop.prototype.reset = function() {
    this.upgrades.item[0].cost = 10;
    this.upgrades.item[1].cost = 10;
    this.upgrades.item[2].cost = 10;
    this.upgrades.item[3].cost = 25;
    this.upgrades.item[4].cost = 10;
    this.upgrades.item[5].cost = 10;
}