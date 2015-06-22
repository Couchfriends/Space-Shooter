SpaceShooter.Enemy = function () {

    SpaceShooter.Element.call( this );
    this.name = 'enemy';
    this.filter = {};
    this.stats = {
        color: 0x00ffff,
        hp: 1,
        score: 10
    };
    this.size = {
        width: 512,
        height: 512
    };

    this.init = function () {
        SpaceShooter.Element.prototype.init.call(this);
    };

    this.update = function (time) {
        SpaceShooter.Element.prototype.update.call(this, time);
    };
    this.destroy = function() {
        if (this.object.visible == false) {
            return;
        }
        SpaceShooter.Tools.addExplosion(this.object.x, this.object.y, this.stats.color);
        SpaceShooter.score += this.stats.score;
        this.remove();
    };

};

SpaceShooter.Enemy.prototype = Object.create( SpaceShooter.Element.prototype );

SpaceShooter.Enemy.prototype.constructor = SpaceShooter.Enemy;

SpaceShooter.EnemyBigShip = function () {

    SpaceShooter.Enemy.call( this );

    this.hitArea = new PIXI.Polygon([
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
        color: 0x003eff,
        hp: 5,
        score: 50
    };
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