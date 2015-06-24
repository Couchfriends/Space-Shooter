/**
 * List of handy tools like reusable particles or explosions
 * @type {{}}
 */
SpaceShooter.Tools = {

    hitSparkles: [],
    hitSparklesCount: 0,
    explosions: [],
    explosionsCount: 0
};

SpaceShooter.Tools.init = function (resources) {

    // @todo fix textures that are loaded
    var textures = [];
    for (var i = 1; i <= 36; i++) {
        var count = '' + i;
        while (count.length < 3) {
            count = '0' + count;
        }
        textures.push(resources['expl1-' + count].texture);
    }
    for (var i = 0; i < 5; i++) {
        var explosion = new SpaceShooter.ExplosionBasic();
        explosion.init(textures);
        explosion.object.visible = false;
        explosion.add();
        this.explosions.push(explosion);
    }

    for (var i = 0; i < 100; i++) {
        var sparkle = new SpaceShooter.Sparkles();
        sparkle.stats = {
            color: 0xffffff,
            particlesCount: 2,
            size: {
                min: 2.6,
                max: 4.8
            },
            speed: {
                x: {
                    min: -5,
                    max: 5
                },
                y: {
                    min: 1,
                    max: 5
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
        sparkle.init();
        sparkle.add();
        sparkle.object.visible = false;
        this.hitSparkles.push(sparkle);
    }
};

/**
 * Function for adding particles (if available) at the impact of an bullet
 * @param x
 * @param y
 * @returns {boolean}
 */
SpaceShooter.Tools.addHitSparkles = function (x, y, color) {
    if (this.hitSparkles[this.hitSparklesCount].object.visible == true) {
        return false;
    }
    sounds['sound-impact'].play();
    if (color != null) {
        this.hitSparkles[this.hitSparklesCount].setColor(color);
    }
    this.hitSparkles[this.hitSparklesCount].object.position.x = x;
    this.hitSparkles[this.hitSparklesCount].object.position.y = y;
    this.hitSparkles[this.hitSparklesCount].object.visible = true;
    this.hitSparklesCount++;
    if (this.hitSparklesCount >= this.hitSparkles.length) {
        this.hitSparklesCount = 0;
    }
};

/**
 * Function for adding standard explosion
 * @param x
 * @param y
 * @returns {boolean}
 */
SpaceShooter.Tools.addExplosion = function (x, y, color) {
    if (this.explosions[this.explosionsCount].object.visible == true) {
        return false;
    }
    sounds['sound-explosion001'].play();
    this.explosions[this.explosionsCount].object.position.x = x;
    this.explosions[this.explosionsCount].object.position.y = y;
    this.explosions[this.explosionsCount].play(color);
    this.explosionsCount++;
    if (this.explosionsCount >= this.explosions.length) {
        this.explosionsCount = 0;
    }
};