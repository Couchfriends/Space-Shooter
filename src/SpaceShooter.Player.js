/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Couchfriends
 * www.couchfriends.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
SpaceShooter.Bullet = function (color) {

    SpaceShooter.Element.call(this);
    this.name = 'bullet';
    this.stats = {
        damage: 1
    };
    this.collisionList = [
        'enemy'
    ];

    this.properties = {
        speed: {
            x: 0,
            y: -20
        }
    };
    this.color = color || 0xff0000;
    this.radius = 5;
};

SpaceShooter.Bullet.prototype = Object.create(SpaceShooter.Element.prototype);
SpaceShooter.Bullet.prototype.constructor = SpaceShooter.Bullet;

SpaceShooter.Bullet.prototype.reset = function () {

    this.speed = {
        x: 0,
        y: 0
    };
    this.object.visible = false;
    this.object.position.x = 0;
    this.object.position.y = 0;
    this.object.beginFill(this.color, 1);
    this.object.drawCircle(this.object.position.x, this.object.position.y, this.radius);

};

SpaceShooter.Bullet.prototype.init = function () {
    this.object = new PIXI.Graphics();
    this.reset();
};
SpaceShooter.Bullet.prototype.shoot = function (x, y, speedX, speedY) {

    speedX = speedX || this.properties.speed.x;
    speedY = speedY || this.properties.speed.y;
    this.object.visible = true;
    this.object.position.x = x;
    this.object.position.y = y;
    this.speed = {
        x: speedX,
        y: speedY
    }
};
SpaceShooter.Bullet.prototype.update = function (time) {
    if (false !== SpaceShooter.Element.prototype.update.call(this, time)) {
        this.object.position.y += this.speed.y;
        this.object.position.x += this.speed.x;
        if (this.object.position.y < -5 || this.object.position.y > renderer.height+5 || this.object.position.x < -5 || this.object.position.x > renderer.width+5) {
            this.reset();
        }
    }
};

SpaceShooter.Bullet.prototype.collision = function (target) {
    if (target.name == 'enemy' || target.name == 'ship') {
        SpaceShooter.Tools.addHitSparkles(this.object.position.x, this.object.position.y, this.color);
        target.damage(this.stats.damage);
        if (target.name == 'ship') {
            achievements.bulletHits = true;
        }
    }
    this.reset();
};

SpaceShooter.BulletEnemy = function (color) {

    SpaceShooter.Bullet.call( this, color );

    this.collisionList = [
        'ship'
    ];

};
SpaceShooter.BulletEnemy.prototype = Object.create( SpaceShooter.Bullet.prototype );

SpaceShooter.BulletEnemy.prototype.constructor = SpaceShooter.BulletEnemy;

SpaceShooter.BulletEnemy.prototype.shoot = function (x, y) {
    // pick random player
    var randomPlayer = Math.floor(Math.random() * players.length);
    if (players[randomPlayer] != null && players[randomPlayer].ship != null) {

        sounds['sound-laser'].play();
        var speedX = (players[randomPlayer].ship.object.position.x - x) / 100;
        var speedY = (players[randomPlayer].ship.object.position.y - y) / 100;
        this.speed = {
            x: speedX,
            y: speedY
        };
        this.object.visible = true;
        this.object.position.x = x;
        this.object.position.y = y;
    }
};

SpaceShooter.BulletEnemyBig = function (color) {

    SpaceShooter.BulletEnemy.call( this, color );

    this.collisionList = [
        'ship'
    ];

    this.properties = {
        speed: {
            x: 0,
            y: -30
        }
    };

    this.radius = 10;
    this.stats = {
        damage: 5
    };

};
SpaceShooter.BulletEnemyBig.prototype = Object.create( SpaceShooter.BulletEnemy.prototype );

SpaceShooter.BulletEnemyBig.prototype.constructor = SpaceShooter.BulletEnemyBig;

SpaceShooter.Ship = function () {

    SpaceShooter.Element.call(this);
    this.playerId = 0;
    this.speed = {
        x: 0,
        y: 0
    };
    this.shooting = false;
    this.maxSpeed = 60;
    this.maxSpeedY = 10;
    this.stats = {
        score: 0,
        hp: 50,
        damage: 5
    };
    this.bulletLevel = 1;
    this.name = 'ship'; // initial name so enemies can't hit it. Will be 'ship'
    //this.hitArea = new PIXI.Rectangle(0,0,55,135);
    this.imuumCountdown = 300;
    this.currentTexture = 5;
    //this.collisionList = [
    //    'enemy'
    //];

    this.textures = [
        'smallfighter0001.png',
        'smallfighter0002.png',
        'smallfighter0003.png',
        'smallfighter0004.png',
        'smallfighter0005.png',
        'smallfighter0006.png',
        'smallfighter0007.png',
        'smallfighter0008.png',
        'smallfighter0009.png',
        'smallfighter0010.png',
        'smallfighter0011.png'
    ];
    this.textureSpeed = (this.maxSpeed * 2) / this.textures.length;
    this.tint = randomColor().replace(/#/, '0x');
    this.originalTint = this.tint;

    this.bullets = [];
    this.bulletCounter = 10;
    for (var i = 0; i < 80; i++) {
        var bullet = new SpaceShooter.Bullet(this.tint);
        bullet.init();
        bullet.add();
        this.bullets.push(bullet);
    }
    this.hpBar = new PIXI.Graphics();
    this.hpBar.beginFill(0x00ff00, 1);
    this.hpBar.drawRect(-25, 80, 50, 7);

};

SpaceShooter.Ship.prototype = Object.create(SpaceShooter.Element.prototype);
SpaceShooter.Ship.prototype.constructor = SpaceShooter.Ship;

SpaceShooter.Ship.prototype.init = function () {
    SpaceShooter.Element.prototype.init.call(this);
    this.object.tint = this.tint;
    this.object.zIndex = 11;
    this.object.addChild(this.hpBar);
};

SpaceShooter.Ship.prototype.setSpeed = function (x, y) {
    if (x > this.maxSpeed) {
        x = this.maxSpeed;
    }
    else if (x < -(this.maxSpeed)) {
        x = -(this.maxSpeed);
    }
    if (y > this.maxSpeedY) {
        y = this.maxSpeedY;
    }
    else if (y < -(this.maxSpeedY)) {
        y = -(this.maxSpeedY);
    }
    this.speed = {
        x: x,
        y: y
    }
};

SpaceShooter.Ship.prototype.collision = function (element) {
    if (this.imuumCountdown <= 0 && element.stats != null && element.stats.damage != null) {
        this.damage(element.stats.damage);
    }
    if (element.stats != null && element.stats.hp != null) {
        element.damage(this.stats.damage);
    }
    var halfX = this.object.width / 2;
    var randomX = getRandom(this.object.position.x - halfX, this.object.position.x + halfX);
    var halfY = this.object.height / 2;
    var randomY = getRandom(this.object.position.y - halfY, this.object.position.y + halfY);
    SpaceShooter.Tools.addHitSparkles(randomX, randomY, this.object.tint);
};

SpaceShooter.Ship.prototype.damage = function (damage) {
    this.stats.hp -= damage;
    var percent = 1 / 50 * this.stats.hp;
    var color = 0x00ff00;
    if (percent < .75) {
        color = 0xffff00;
    }
    if (percent < .5) {
        color = 0xff9900;
    }
    if (percent < .25) {
        color = 0xff0000;
    }
    this.object.children[0].clear();
    this.object.children[0].beginFill(color, 1);
    this.hpBar.drawRect(-25, 80, 50, 7);
    this.object.children[0].scale.x = percent;
    if (this.stats.hp <= 0) {
        this.object.children[0].clear();
        this.object.children[0].beginFill(0x00ff00, 1);
        this.hpBar.drawRect(-25, 80, 50, 7);
        this.object.children[0].scale.x = 1;
        this.died();
        return;
    }
};

/**
 * Player died
 */
SpaceShooter.Ship.prototype.died = function () {

    this.name = 'ship';
    this.tint = this.originalTint;
    this.imuumCountdown = 300;
    this.stats.hp = 50;
    SpaceShooter.Tools.addExplosion(this.object.position.x, this.object.position.y, this.object.tint);
    this.object.position.x = renderer.width / 2;
    this.object.position.y = renderer.height - this.object.height - 20;
    this.speed.x = 0;
    this.speed.y = 0;
    vibrate(this.playerId, 600); // 36 frames on 60fps
    this.bulletLevel = 1;
    for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].properties.speed.x = 0;
        this.bullets[i].properties.speed.y = -20;
    }
    SpaceShooter.removeLife();

};

SpaceShooter.Ship.prototype.update = function () {
    if (this.object.visible == false) {
        return;
    }
    if (this.imuumCountdown > 0) {
        this.imuumCountdown--;
        if (this.imuumCountdown%20<10) {
            this.object.tint = 0x000000;
        }
        else {
            this.object.tint = this.originalTint;
        }
        if (this.imuumCountdown <= 0) {
            this.object.tint = this.originalTint;
        }
    }
    this.object.position.y += this.speed.y;
    this.object.position.x += this.speed.x;
    if (this.object.position.x < (this.object.width/2)) {
        this.object.position.x = (this.object.width/2);
    }
    else if (this.object.position.x > (SpaceShooter.settings.width - (this.object.width/2))) {
        this.object.position.x = (SpaceShooter.settings.width - (this.object.width/2));
    }
    if (this.object.position.y < (this.object.height/2)) {
        this.object.position.y = (this.object.height/2);
    }
    else if (this.object.position.y > (SpaceShooter.settings.height - (this.object.height/2))) {
        this.object.position.y = (SpaceShooter.settings.height - (this.object.height/2));
    }
    var texture = Math.floor(this.speed.x / this.textureSpeed) + Math.floor(this.textures.length / 2);
    if (texture < 0) {
        texture = 0;
    }
    else if (texture >= this.textures.length) {
        texture = this.textures.length - 1;
    }
    if (texture != this.currentTexture) {
        this.currentTexture = texture;
        this.object.texture = this.textures[this.currentTexture];
    }
    var y = this.object.position.y - (this.object.height / 2);
    if (this.shooting == true) {
        this.bulletCounter--;
        if (this.bulletCounter <= 0) {
            this.bulletCounter = 7;
            var shot = false;
            var x = this.object.position.x - ((this.bulletLevel-1) * 8);
            for (var j = 1; j <= this.bulletLevel; j++) {
                for (var i = 0; i < this.bullets.length; i++) {
                    var speedX = 0;
                    var speedY = -20;
                    if (!this.bullets[i].object.visible) {
                        if (this.bulletLevel == 4 && j == 1) {
                            speedX = -5;
                        }
                        else if (this.bulletLevel == 4 && j == 4) {
                            speedX = 5;
                        }
                        else if (this.bulletLevel == 5 && j == 1) {
                            speedX = -5;
                        }
                        else if (this.bulletLevel == 5 && j == 5) {
                            speedX = 5;
                        }
                        this.bullets[i].shoot(x, y, speedX, speedY);
                        shot = true;
                        x += 16;
                        j++;
                    }
                    if (j > this.bulletLevel || j > 10) {
                        break;
                    }
                }
            }
            if (shot == true) {
                sounds['sound-laser'].play();
            }
        }
    }

    // Do some collision detection here
    var collisionObject = this.checkCollision();
    if (collisionObject != false || this.object.position.y < 0) {
        if (collisionObject != false) {
            this.collision(collisionObject);
        }
    }
};