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
SpaceShooter.Enemy = function () {

    SpaceShooter.Element.call(this);
    this.name = 'enemy';
    this.filter = {};
    this.stats = {
        color: 0x00ffff,
        hp: 1,
        score: 10,
        damage: 5
    };
    this.size = {
        width: 512,
        height: 512
    };
    this.collisionList = [
        'ship'
    ];

    this.bullets = [];
    this.numberOfBullets = 2;
    this.bulletCounter = 50;
    this._bulletCounter = this.bulletCounter;

};

SpaceShooter.Enemy.prototype = Object.create(SpaceShooter.Element.prototype);

SpaceShooter.Enemy.prototype.constructor = SpaceShooter.Enemy;

SpaceShooter.Enemy.prototype.init = function (textures) {
    SpaceShooter.Element.prototype.init.call(this, textures);
    this._bulletCounter = this.bulletCounter;
    for (var i = 0; i < this.numberOfBullets; i++) {
        var bullet = new SpaceShooter.BulletEnemy(0xff0000);
        bullet.init();
        bullet.add();
        this.bullets.push(bullet);
    }
};

SpaceShooter.Enemy.prototype.update = function (time) {
    SpaceShooter.Element.prototype.update.call(this, time);
};

SpaceShooter.Enemy.prototype.destroy = function () {
    if (this.object.visible == false) {
        return false;
    }
    SpaceShooter.Tools.addBonus(this.object.position.x, this.object.position.y);
    SpaceShooter.Tools.addExplosion(this.object.x, this.object.y, this.stats.color);
    SpaceShooter.addScore(this.stats.score, this.object.x, this.object.y);
    this.remove();
};

SpaceShooter.Enemy.prototype.collision = function (element) {
    if (element.name == 'ship') {
        element.collision(this);
    }
};
SpaceShooter.Enemy.prototype.damage = function (damage) {
    this.stats.hp -= damage;
    if (this.stats.hp < 0) {
        this.destroy();
    }
};

SpaceShooter.EnemyBigShip = function () {

    SpaceShooter.Enemy.call(this);

    this.hitArea = new PIXI.Polygon([
            new PIXI.Point(-102, -184),
            new PIXI.Point(109, -184),
            new PIXI.Point(109, 75),
            new PIXI.Point(4, 184),
            new PIXI.Point(-102, 75)
        ]
    );

    this.filter = {};
    this.stats = {
        hp: 20,
        score: 250
    };

    this.size = {
        width: 12,
        height: 12
    };

    this.textures = ['wship1.png'];
    this.texturesNormals = ['wship1n.png'];
    this.numberOfBullets = 4;
    this.bulletCounter = 100;

};
SpaceShooter.EnemyBigShip.prototype = Object.create(SpaceShooter.Enemy.prototype);

SpaceShooter.EnemyBigShip.prototype.constructor = SpaceShooter.EnemyBigShip;

SpaceShooter.EnemyBigShip.prototype.init = function (textures) {
    SpaceShooter.Element.prototype.init.call(this, textures);
    this._bulletCounter = this.bulletCounter;
    for (var i = 0; i < this.numberOfBullets; i++) {
        var bullet = new SpaceShooter.BulletEnemyBig(0xff0000);
        bullet.init();
        bullet.add();
        this.bullets.push(bullet);
    }
};

SpaceShooter.EnemyBigShip.prototype.update = function (time) {
    if (false !== SpaceShooter.Enemy.prototype.update.call(this, time)) {
        this.bulletCounter--;
        if (this.bulletCounter <= 0) {
            for (var i = 0; i < this.bullets.length; i++) {
                if (!this.bullets[i].object.visible) {
                    this.bullets[i].shoot(this.object.position.x, this.object.position.y+184);
                    this.bulletCounter = this._bulletCounter;
                    break;
                }
            }
        }

    }
};

SpaceShooter.EnemyAsteroid = function () {

    SpaceShooter.Enemy.call(this);
    this.filter = {};
    this.stats = {
        color: 0xdddddd,
        hp: 4,
        score: 40,
        damage: 10
    };
    this.hitArea = new PIXI.Circle(0, 0, 64);

    this.size = {
        width: 36,
        height: 36
    };

    this.textures = [
        'asteroid001.png',
        'asteroid002.png',
        'asteroid003.png',
        'asteroid004.png'
    ];

    this.texturesNormals = [
        'asteroid001n.png',
        'asteroid002n.png',
        'asteroid003n.png',
        'asteroid004n.png'
    ];

};
SpaceShooter.EnemyAsteroid.prototype = Object.create(SpaceShooter.Enemy.prototype);

SpaceShooter.EnemyAsteroid.prototype.constructor = SpaceShooter.EnemyAsteroid;

SpaceShooter.EnemyAsteroid.prototype.init = function () {

    var texture = Math.floor(getRandom(0, this.textures.length));
    this.textures = [this.textures[texture]];
    this.texturesNormals = [this.texturesNormals[texture]];
    SpaceShooter.Enemy.prototype.init.call(this);
//    var normalMapTexture = PIXI.Texture.fromImage(SpaceShooter.settings.assetsDir + this.texturesNormals[0]);
//    this.filter = new PIXI.filters.NormalMapFilter(normalMapTexture);
//
//    this.filter.uniforms.mapDimensions.value.x = 128;
//    this.filter.uniforms.mapDimensions.value.y = 128;
//
////    this.object.filters = [this.filter];
//    this.object.normalTexture = normalMapTexture;

};

SpaceShooter.EnemyAsteroid.prototype.destroy = function () {
    var destroyed = SpaceShooter.Enemy.prototype.destroy.call(this);
    if (destroyed != false) {
        achievements.asteroidsKilled++;
        if (achievements.asteroidsKilled == 10) {
            for (var i = 0; i < players.length; i++) {
                var jsonData = {
                    topic: 'game',
                    action: 'achievementUnlock',
                    data: {
                        playerId: players[i].id,
                        key: 'asteroid_fighter'
                    }
                };
                COUCHFRIENDS.send(jsonData);
            }
        }
    }
};

SpaceShooter.EnemyUfo = function () {

    SpaceShooter.Enemy.call(this);
    this.filter = {};
    this.stats = {
        color: 0x003eff,
        hp: 5,
        score: 75,
        damage: 5
    };
    this.hitArea = new PIXI.Circle(0, 0, 36);

    this.size = {
        width: 36,
        height: 36
    };

    this.textures = [
        'alien10001.png',
        'alien10002.png',
        'alien10003.png',
        'alien10004.png',
        'alien10005.png',
        'alien10006.png',
        'alien10007.png',
        'alien10008.png',
        'alien10009.png',
        'alien10010.png',
        'alien10011.png',
        'alien10012.png',
        'alien10013.png',
        'alien10014.png',
        'alien10015.png'
    ];
    this.bulletCounter = 200;

};
SpaceShooter.EnemyUfo.prototype = Object.create(SpaceShooter.Enemy.prototype);

SpaceShooter.EnemyUfo.prototype.constructor = SpaceShooter.EnemyUfo;

SpaceShooter.EnemyUfo.prototype.update = function (time) {
    if (false !== SpaceShooter.Enemy.prototype.update.call(this, time)) {
        this.bulletCounter--;
        if (this.bulletCounter <= 0) {
            for (var i = 0; i < this.bullets.length; i++) {
                if (!this.bullets[i].object.visible) {
                    this.bullets[i].shoot(this.object.position.x, this.object.position.y);
                    this.bulletCounter = this._bulletCounter;
                    break;
                }
            }
        }

    }
};

SpaceShooter.EnemyUfo.prototype.destroy = function () {
    var destroyed = SpaceShooter.Enemy.prototype.destroy.call(this);
    if (destroyed != false) {
        achievements.ufosKilled++;
        if (achievements.ufosKilled == 10) {
            for (var i = 0; i < players.length; i++) {
                var jsonData = {
                    topic: 'game',
                    action: 'achievementUnlock',
                    data: {
                        playerId: players[i].id,
                        key: 'not_from_this_world'
                    }
                };
                COUCHFRIENDS.send(jsonData);
            }
        }
        if (achievements.ufosKilled == 20 && achievements.bulletHits == false) {
            for (var i = 0; i < players.length; i++) {
                var jsonData = {
                    topic: 'game',
                    action: 'achievementUnlock',
                    data: {
                        playerId: players[i].id,
                        key: 'bullet_dodge'
                    }
                };
                COUCHFRIENDS.send(jsonData);
            }
        }
    }
};
