SpaceShooter.Bullet = function () {

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
    this.radius = 5;
};

SpaceShooter.Bullet.prototype = Object.create(SpaceShooter.Element.prototype);
SpaceShooter.Bullet.prototype.constructor = SpaceShooter.Bullet;

SpaceShooter.Bullet.prototype.reset = function () {

    this.speed = {
        x: 0,
        y: 0
    };
    this.radius = 5;
    this.object.visible = false;
    this.object.position.x = 0;
    this.object.position.y = 0;
    this.object.beginFill(0xffffff, 1);
    this.object.drawCircle(this.object.position.x, this.object.position.y, this.radius);

};

SpaceShooter.Bullet.prototype.init = function () {
    this.object = new PIXI.Graphics();
    this.reset();
};
SpaceShooter.Bullet.prototype.shoot = function (x, y) {
    this.object.visible = true;
    this.object.position.x = x;
    this.object.position.y = y;
    this.speed = {
        x: this.properties.speed.x,
        y: this.properties.speed.y
    }
};
SpaceShooter.Bullet.prototype.update = function () {
    if (this.object.visible == false) {
        return;
    }
    this.object.position.y += this.speed.y;
    this.object.position.x += this.speed.x;
    // Do some collision detection here
    var collisionObject = this.checkCollision();
    if (collisionObject != false || this.object.position.y < 0) {
        if (collisionObject != false) {
            this.collision(collisionObject);
        }
        this.reset();
    }
};
SpaceShooter.Bullet.prototype.collision = function (target) {
    if (target.name == 'enemy') {
        SpaceShooter.Tools.addHitSparkles(this.object.position.x, this.object.position.y, 0xff9900);
        target.stats.hp -= this.stats.damage;
        if (target.stats.hp < 0) {
            target.destroy();
        }
    }
};

SpaceShooter.Ship = function () {

    SpaceShooter.Element.call(this);

    this.speed = {
        x: 0,
        y: 0
    };
    this.shooting = false;
    this.maxSpeed = 60;
    this.name = 'ship';
    this.currentTexture = 5;
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
    this.tint = '#' + '0123456789abcdef'.split('').map(function (v, i, a) {
        return i > 5 ? null : a[Math.floor(Math.random() * 16)]
    }).join('');

    this.bullets = [];
    this.bulletCounter = 5;
    for (var i = 0; i < 20; i++) {
        var bullet = new SpaceShooter.Bullet();
        bullet.init();
        bullet.add();
        this.bullets.push(bullet);
    }

};

SpaceShooter.Ship.prototype = Object.create(SpaceShooter.Element.prototype);
SpaceShooter.Ship.prototype.constructor = SpaceShooter.Ship;

SpaceShooter.Ship.prototype.init = function () {
    SpaceShooter.Element.prototype.init.call(this);
    this.object.tint = this.tint.replace(/#/, '0x');
};

SpaceShooter.Ship.prototype.setSpeed = function (x, y) {
    if (x > this.maxSpeed) {
        x = this.maxSpeed;
    }
    else if (x < -(this.maxSpeed)) {
        x = -(this.maxSpeed);
    }
    if (y > this.maxSpeed) {
        y = this.maxSpeed;
    }
    else if (y < -(this.maxSpeed)) {
        y = -(this.maxSpeed);
    }
    this.speed = {
        x: x,
        y: y
    }
};

SpaceShooter.Ship.prototype.update = function () {
    this.object.position.x += this.speed.x;
    this.object.position.y += this.speed.y;
    if (this.object.position.x < 0) {
        this.object.position.x = 0;
    }
    else if (this.object.position.x > SpaceShooter.settings.width) {
        this.object.position.x = SpaceShooter.settings.width;
    }
    if (this.object.position.y < 0) {
        this.object.position.y = 0;
    }
    else if (this.object.position.y > SpaceShooter.settings.height) {
        this.object.position.y = SpaceShooter.settings.height;
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
    if (this.shooting == true) {
        this.bulletCounter--;
        if (this.bulletCounter > 0) {
            return;
        }
        for (var i = 0; i < this.bullets.length; i++) {
            if (!this.bullets[i].object.visible) {
                this.bullets[i].shoot(this.object.position.x, this.object.position.y);
                this.bulletCounter = 5;
                break;
            }
        }
    }
};