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

SpaceShooter.Background = function (file) {

    SpaceShooter.Element.call(this);

    this.name = 'background';

    //this.textures = [
    //    'background-far.jpg'
    //];

    this.speed = .128;

};

SpaceShooter.Background.prototype = Object.create(SpaceShooter.Element.prototype);

SpaceShooter.Background.prototype.constructor = SpaceShooter.Background;

SpaceShooter.Background.prototype.init = function (texture) {

    texture = texture || PIXI.Texture.fromImage(SpaceShooter.settings.assetsDir + this.textures[0]);
    this.object = new PIXI.extras.TilingSprite(texture, SpaceShooter.settings.width, SpaceShooter.settings.width);
    this.object.zIndex = 1;

};

SpaceShooter.Background.prototype.update = function () {
    this.object.tilePosition.y += this.speed;
};

SpaceShooter.Star = function () {

    SpaceShooter.Element.call(this);
    this.name = 'star';
};

SpaceShooter.Star.prototype = Object.create(SpaceShooter.Element.prototype);

SpaceShooter.Star.prototype.constructor = SpaceShooter.Star;

SpaceShooter.Star.prototype.reset = function () {
    this.radius = getRandom(0.5, 2);
    this.speed = this.radius / 4;//getRandom(0.00001, 1);
    this.object.beginFill(0xffffff, 1);
    this.object.position.x = Math.random() * SpaceShooter.settings.width;
    this.object.position.y = 0;
    this.object.zIndex = 2;
};
SpaceShooter.Star.prototype.init = function () {
    this.object = new PIXI.Graphics();
    this.reset();
    this.object.drawCircle(this.object.position.x, this.object.position.y, this.radius);
    this.object.position.y = Math.random() * SpaceShooter.settings.height;
};
SpaceShooter.Star.prototype.update = function () {
    this.object.position.y += this.speed;
    if (this.object.position.y > SpaceShooter.settings.height) {
        this.reset();
    }
};

SpaceShooter.Explosion = function () {

    SpaceShooter.Element.call(this);
    this.name = 'explosion';
    this.textureSpeed = 1;
    this.resetAfterLastTexture = true;
};

SpaceShooter.Explosion.prototype = Object.create(SpaceShooter.Element.prototype);

SpaceShooter.Explosion.prototype.constructor = SpaceShooter.Explosion;

SpaceShooter.Explosion.prototype.reset = function () {
    this.object.visible = false;
    for (var i = 0; i < this.object.children.length; i++) {
        this.object.children[i].reset();
    }
};

SpaceShooter.Explosion.prototype.play = function (color) {
    this.object.visible = true;
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].object.visible = true;
        if (color != null) {
            this.children[i].setColor(color);
        }
        this.children[i].object.position = this.object.position;
    }
};

SpaceShooter.ExplosionBasic = function () {

    SpaceShooter.Explosion.call(this);
    this.textures = [
        'expl1-001.png',
        'expl1-002.png',
        'expl1-003.png',
        'expl1-004.png',
        'expl1-005.png',
        'expl1-006.png',
        'expl1-007.png',
        'expl1-008.png',
        'expl1-009.png',
        'expl1-010.png',
        'expl1-011.png',
        'expl1-012.png',
        'expl1-013.png',
        'expl1-014.png',
        'expl1-015.png',
        'expl1-016.png',
        'expl1-017.png',
        'expl1-018.png',
        'expl1-019.png',
        'expl1-020.png',
        'expl1-021.png',
        'expl1-022.png',
        'expl1-023.png',
        'expl1-024.png',
        'expl1-025.png',
        'expl1-026.png',
        'expl1-027.png',
        'expl1-028.png',
        'expl1-029.png',
        'expl1-030.png',
        'expl1-031.png',
        'expl1-032.png',
        'expl1-033.png',
        'expl1-034.png',
        'expl1-035.png',
        'expl1-036.png'
    ];
    this.init = function (textures) {
        SpaceShooter.Explosion.prototype.init.call(this, textures);
        var sparkle = new SpaceShooter.Sparkles();
        sparkle.init();
        sparkle.add();
        sparkle.object.visible = false;
        this.addChild(sparkle);
    };

};

SpaceShooter.ExplosionBasic.prototype = Object.create(SpaceShooter.Explosion.prototype);

SpaceShooter.ExplosionBasic.prototype.constructor = SpaceShooter.ExplosionBasic;

SpaceShooter.Sparkles = function () {

    SpaceShooter.Element.call(this);
    this.name = 'sparkles';
    this.stats = {
        color: 0xffffff,
        particlesCount: 50,
        size: {
            min: 2.5,
            max: 3.5
        },
        speed: {
            x: {
                min: -8,
                max: 8
            },
            y: {
                min: -8,
                max: 8
            },
            reduce: {
                x: {
                    min: .8,
                    max: 1
                },
                y: {
                    min: .8,
                    max: 1
                }
            }
        }
    };
};
SpaceShooter.Sparkles.prototype = Object.create(SpaceShooter.Element.prototype);

SpaceShooter.Sparkles.prototype.constructor = SpaceShooter.Sparkles;

SpaceShooter.Sparkles.prototype.reset = function () {
    this.object.visible = false;
    for (var i = 0; i < this.object.children.length; i++) {
        this.object.children[i].reset();
    }
};

SpaceShooter.Sparkles.prototype.setColor = function (color) {
    for (var i = 0; i < this.object.children.length; i++) {
        this.object.children[i].beginFill(color, 1);
        this.object.children[i].drawCircle(0, 0, Math.random() * this.stats.size.max - this.stats.size.min);
    }
};

SpaceShooter.Sparkles.prototype.init = function () {
    this.object = new PIXI.Container();
    this.object.visible = false;
    for (var i = 0; i < this.stats.particlesCount; i++) {
        var particle = new PIXI.Graphics();
        particle.beginFill(0xffffff, 1);
        particle.drawCircle(0, 0, Math.random() * this.stats.size.max - this.stats.size.min);
        particle.stats = clone(this.stats);
        particle.reset = function () {
            this.beginFill(this.stats.color, 1);
            this.drawCircle(0, 0, Math.random() * this.stats.size.max - this.stats.size.min);
            this.position.x = 0;
            this.position.y = 0;
            this.alpha = 1;
            this.speed = {
                x: getRandom(this.stats.speed.x.min, this.stats.speed.x.max),
                y: getRandom(this.stats.speed.y.min, this.stats.speed.y.max)
            };
            this.speed.reduceX = getRandom(this.stats.speed.reduce.x.min, this.stats.speed.reduce.x.max);
            this.speed.reduceY = getRandom(this.stats.speed.reduce.y.min, this.stats.speed.reduce.y.max);
        };
        particle.reset();
        this.object.addChild(particle);
    }

};
SpaceShooter.Sparkles.prototype.update = function (time) {

    if (this.object.visible == false) {
        return false;
    }
    for (var i = 0; i < this.object.children.length; i++) {
        this.object.children[i].position.x += this.object.children[i].speed.x;
        this.object.children[i].position.y += this.object.children[i].speed.y;
        this.object.children[i].speed.x *= this.object.children[i].speed.reduceX;
        this.object.children[i].speed.y *= this.object.children[i].speed.reduceY;
        this.object.children[i].alpha *= .98;
        if (this.object.children[i].alpha < .2) {
            this.reset();
        }
    }

};

SpaceShooter.Text = function () {

    SpaceShooter.Element.call(this);
    this.name = 'font';
    this.text = '';
    this.font = 'bold 60px Arial';
    this.fill = '#ff9900';
    this.align = 'center';
    this.stroke = '#ffffff';
    this.strokeThickness = 6;
};

SpaceShooter.Text.prototype = Object.create(SpaceShooter.Element.prototype);

SpaceShooter.Text.prototype.constructor = SpaceShooter.Text;

SpaceShooter.Text.prototype.init = function() {
    this.object = new PIXI.Text(this.text, {
        font: this.font,
        fill: this.fill,
        align: this.align,
        stroke: this.stroke,
        strokeThickness: this.strokeThickness
    });
    this.object.anchor.x = 1;
    this.object.anchor.y = 0;
    this.object.zIndex = 99;
};

SpaceShooter.TextScore = function () {

    SpaceShooter.Text.call(this);
    this.displayScore = -1;
    this.name = 'font';
    this.text = '';
    this.font = 'bold 30px Arial';
    this.fill = '#000000';
    this.align = 'right';
    this.stroke = '#ffffff';
    this.strokeThickness = 3;
};
SpaceShooter.TextScore.prototype = Object.create(SpaceShooter.Text.prototype);

SpaceShooter.TextScore.prototype.constructor = SpaceShooter.TextScore;

SpaceShooter.TextScore.prototype.update = function(time) {
    SpaceShooter.Text.prototype.update.call(this, time);
    if (this.displayScore == SpaceShooter.score) {
        return;
    }
    if (this.displayScore < (SpaceShooter.score-10000)) {
        this.displayScore += 10000;
    }
    else if (this.displayScore < (SpaceShooter.score-1000)) {
        this.displayScore += 1000;
    }
    else if (this.displayScore < (SpaceShooter.score-100)) {
        this.displayScore += 100;
    }
    else if (this.displayScore < (SpaceShooter.score-10)) {
        this.displayScore += 10;
    }
    else if (this.displayScore < SpaceShooter.score) {
        this.displayScore++;
    }
    else if (this.displayScore > (SpaceShooter.score+10000)) {
        this.displayScore -= 10000;
    }
    else if (this.displayScore > (SpaceShooter.score+1000)) {
        this.displayScore -= 1000;
    }
    else if (this.displayScore > (SpaceShooter.score+100)) {
        this.displayScore -= 100;
    }
    else if (this.displayScore > (SpaceShooter.score+10)) {
        this.displayScore -= 10;
    }
    else {
        this.displayScore--;
    }
    this.object.text = SpaceShooter.scoreCurrency + ' ' + this.displayScore;
};

/**
 * A small token of reward after killing something
 * @constructor
 */
SpaceShooter.TextBonusScore = function () {

    SpaceShooter.Text.call(this);
    this.speed = 5;
    this.name = 'font';
    this.text = '';
    this.font = 'bold 36px Arial';
    this.fill = '#ff0000';
    this.align = 'center';
    this.stroke = '#ffffff';
    this.strokeThickness = 3;
};
SpaceShooter.TextBonusScore.prototype = Object.create(SpaceShooter.Text.prototype);

SpaceShooter.TextBonusScore.prototype.constructor = SpaceShooter.TextBonusScore;

SpaceShooter.TextBonusScore.prototype.init = function() {
    SpaceShooter.Text.prototype.init.call(this);
    this.object.anchor.x = .5;
    this.object.anchor.y = .5;
};

SpaceShooter.TextBonusScore.prototype.update = function(time) {
    var update = SpaceShooter.Text.prototype.update.call(this, time);
    if (update != false) {
        this.object.position.y -= this.speed;
        if (this.speed > 0) {
            this.speed *= .92;
        }
        this.object.alpha -= .015;
    }
    if (this.object.alpha < .1) {
        this.object.visible = false;
        this.speed = 5;
        this.object.alpha = 1;
    }
};


SpaceShooter.Bonus = function () {

    SpaceShooter.Element.call(this);
    this.color = 0xfff000;
    this.textures = [
        'shield-gold.png'
    ];
    this.collisionList = [
        'ship'
    ];

};

SpaceShooter.Bonus.prototype = Object.create(SpaceShooter.Element.prototype);

SpaceShooter.Bonus.prototype.constructor = SpaceShooter.Bonus;

SpaceShooter.Bonus.prototype.update = function(time) {
    var update = SpaceShooter.Element.prototype.update.call(this, time);
    if (update != false) {
        this.object.position.y += .5;
    }
    var date = new Date();
    var milliseconds = .5 + (Math.abs((500 - date.getMilliseconds())/2) / 500);
    this.object.scale.x = this.object.scale.y = milliseconds;
    if (this.object.position.y > (renderer.height + this.object.height)) {
        this.object.visible = false;
    }
};

SpaceShooter.Bonus.prototype.collision = function (target) {
    this.object.visible = false;
    sounds['sound-bonus'].play();
};

/**
 * Power up guns
 * @constructor
 */
SpaceShooter.BonusGun = function () {

    SpaceShooter.Bonus.call(this);
    this.textures = [
        'bolt-gold.png'
    ];
};

SpaceShooter.BonusGun.prototype = Object.create(SpaceShooter.Bonus.prototype);

SpaceShooter.BonusGun.prototype.constructor = SpaceShooter.BonusGun;

SpaceShooter.BonusGun.prototype.collision = function (target) {
    if (target.name == 'ship') {
        SpaceShooter.Tools.addPickupSparkles(this.object.position.x, this.object.position.y, this.color);
        if (target.bulletLevel < 5) {
            target.bulletLevel++;
        }
    }
    SpaceShooter.Bonus.prototype.collision.call(this, target);
};

/**
 * Power up health
 * @constructor
 */
SpaceShooter.BonusShield = function () {

    SpaceShooter.Bonus.call(this);
    this.textures = [
        'shield-gold.png'
    ];
};

SpaceShooter.BonusShield.prototype = Object.create(SpaceShooter.Bonus.prototype);

SpaceShooter.BonusShield.prototype.constructor = SpaceShooter.BonusShield;

SpaceShooter.BonusShield.prototype.collision = function (target) {
    if (target.name == 'ship') {
        SpaceShooter.Tools.addPickupSparkles(this.object.position.x, this.object.position.y, this.color);
        target.stats.hp = 50;
        target.damage(0);
    }
    SpaceShooter.Bonus.prototype.collision.call(this, target);
};

/**
 * Power up money
 * @constructor
 */
SpaceShooter.BonusMoney = function () {

    SpaceShooter.Bonus.call(this);
    this.textures = [
        'star-gold.png'
    ];
};

SpaceShooter.BonusMoney.prototype = Object.create(SpaceShooter.Bonus.prototype);

SpaceShooter.BonusMoney.prototype.constructor = SpaceShooter.BonusMoney;

SpaceShooter.BonusMoney.prototype.collision = function (target) {
    if (target.name == 'ship') {
        SpaceShooter.Tools.addPickupSparkles(this.object.position.x, this.object.position.y, this.color);
        SpaceShooter.addScore(500, this.object.position.x, this.object.position.y);
    }
    SpaceShooter.Bonus.prototype.collision.call(this, target);
};