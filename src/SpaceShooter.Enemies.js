SpaceShooter.Enemy = function () {

    SpaceShooter.Element.call( this );
    this.name = 'enemy';
    this.filter = {};
    this.stats = {
        hp: 1,
        score: 10
    };
    // Will be spawned after destroying this enemy
    this.parts = [];
    this.size = {
        width: 512,
        height: 512
    };
    this.explosion = new SpaceShooter.ExplosionBasic();

    this.init = function () {
        SpaceShooter.Element.prototype.init.call(this);
        this.explosion.init();
        this.explosion.add();
        this.explosion.object.position = this.object.position;
        this.explosion.object.visible = false;
    };

    this.update = function (time) {
        SpaceShooter.Element.prototype.update.call(this, time);
    };
    this.destroy = function() {
        if (this.object.visible == false) {
            return;
        }
        addExplosionSparkles(this.object.x, this.object.y);
        this.explosion.object.visible = true;
        SpaceShooter.score += this.stats.score;
        for (var i = 0; i < this.parts.length; i++) {
            this.parts[i].object.visible = true;
            this.parts[i].object.position.x = this.object.position.x;
            this.parts[i].object.position.y = this.object.position.y;
        }
        this.remove();
    };

};

SpaceShooter.Enemy.prototype = Object.create( SpaceShooter.Element.prototype );

SpaceShooter.Enemy.prototype.constructor = SpaceShooter.Enemy;

SpaceShooter.EnemyBigShip = function () {

    SpaceShooter.Enemy.call( this );

    this.hitArea = {};new PIXI.Polygon([
            new PIXI.Point(150, 73),
            new PIXI.Point(361, 73),
            new PIXI.Point(361, 332),
            new PIXI.Point(256, 441),
            new PIXI.Point(150, 332)
        ]
    );

    this.filter = {};
    this.stats = {
        hp: 5,
        score: 50
    };

    for (var i = 0; i < 8; i++) {
        var part = new SpaceShooter.EnemyPart();
        part.object.position.x = -100;
        part.object.position.y = -100;
        part.object.visible = false;
        part.add();
        this.parts.push(part);
    }

    this.size = {
        width: 12,
        height: 12
    };

    this.textures = ['wship1.png'];
    this.texturesNormals = ['wship1n.png'];

};
SpaceShooter.EnemyBigShip.prototype = Object.create( SpaceShooter.Enemy.prototype );

SpaceShooter.EnemyBigShip.prototype.constructor = SpaceShooter.EnemyBigShip;

SpaceShooter.EnemyUfo = function () {

    SpaceShooter.Enemy.call( this );
    this.filter = {};
    this.stats = {
        hp: 5,
        score: 50
    };
    this.parts = [];
    this.hitArea = new PIXI.Circle(0,0,36);

    this.size = {
        width: 12,
        height: 12
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

};
SpaceShooter.EnemyUfo.prototype = Object.create( SpaceShooter.Enemy.prototype );

SpaceShooter.EnemyUfo.prototype.constructor = SpaceShooter.EnemyUfo;

SpaceShooter.EnemyPart = function () {

    this.name = 'enemy-part';
    this.filter = {};

    this.images = [
        'wship1-part1.png',
        'wship1-part2.png',
        'wship1-part3.png',
        'wship1-part4.png'
    ];
    this.imagesNormal = [
        'wship1-part1n.png',
        'wship1-part2n.png',
        'wship1-part3n.png',
        'wship1-part4n.png'
    ];
    this.speed = {
        x: Math.random() * 5 - 2.5,
        y: Math.random() * 5 - 2.5,
        r: (Math.random() * 2 - 1) / 100
    };
    this.timer = 175;

    this.reset = function () {
        this.object.visible = false;
        this.speed = {
            x: Math.random() * 5 - 2.5,
            y: Math.random() * 5 - 2.5,
            r: (Math.random() * 2 - 1) / 100
        };
        this.timer = 175;
    };

    this.init = function () {
        var rand = Math.floor(Math.random() * this.images.length);
        var image = this.images[rand];
        var normal = this.imagesNormal[rand];
        //var normalTexture = PIXI.Texture.fromImage(SpaceShooter.settings.assetsDir + normal);
        var texture = PIXI.Texture.fromImage(SpaceShooter.settings.assetsDir + image);
        //this.filter = new PIXI.filters.NormalMapFilter(normalTexture);
        this.object = new PIXI.Sprite(texture);
        this.object.anchor.x = 0.5;
        this.object.anchor.y = 0.5;
        //this.object.filters = [this.filter];
        this.object.visible = false;
    };
    this.update = function (time) {
        if (this.object.visible == false) {
            return;
        }
        //this.filter.uniforms.LightPos.value = SpaceShooter.LightPos;
        this.object.x += this.speed.x;
        this.object.y += this.speed.y;
        this.object.rotation += this.speed.r;
        this.timer--;
        this.speed.x *= .99;
        this.speed.y *= .99;
        if (this.timer < 0) {
            //this.remove();
            this.reset();
        }
    };
    this.init();

};
SpaceShooter.EnemyPart.prototype = new SpaceShooter.Element();