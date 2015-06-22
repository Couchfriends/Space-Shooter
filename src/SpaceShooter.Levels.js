SpaceShooter.Level = function () {

    this.name = 'Level name';
    this.description = 'Level description';
    /**
     * All assets objects with {name: 'name', file: 'asset.jpg'}
     * @type {Array}
     */
    this.assets = [];

    /**
     * Name with resources that has been defined in this.assets
     * @type {Array}
     */
    this.resources = [];

};

SpaceShooter.Level.prototype.constructor = SpaceShooter.Level;

/**
 * Loads all assets and play() after loading is complete
 */
SpaceShooter.Level.prototype.start = function () {
    var loader = PIXI.loader;
    loader.level = this;
    for (var i = 0; i < this.assets.length; i++) {
        loader.add(this.assets[i].name, SpaceShooter.settings.assetsDir + this.assets[i].file);
    }
    loader.on('progress', function (a, b, c) {
        //console.log(a, b, c);
    });
    loader.load(function (loader, resources) {
        loader.level.resources = resources;
        /*
         PIXI.loader
         // add resources
         .add('name1', 'url/to/resource1.png')
         .add('name2', 'url/to/resource2.json')
         // listen for progress
         .on('progress', onProgressCallback)
         // load resources
         .load(function (loader, resources) {
         // resources is an object containing the loaded resources, keyed by the names you used above.

         var sprite = new PIXI.Sprite(resources.name1.texture);
         });
         */
        loader.level.play();
        SpaceShooter.Tools.init(resources);
    });
};

SpaceShooter.Level.prototype.play = function () {
    console.log('Play what? Thin air?');
};

SpaceShooter.Level1 = function () {

};

SpaceShooter.Level1 = function () {

    SpaceShooter.Level.call(this);
    this.name = 'Level 1';
    this.assets = [
        {
            name: 'background',
            file: 'background-far.jpg'
        }
    ];

    // Explosion
    for (var i = 1; i <= 36; i++) {
        var count = '' + i;
        while (count.length < 3) {
            count = '0' + count;
        }
        this.assets.push({
            name: 'expl1-' + count,
            file: 'expl1-' + count + '.png'
        });
    }
};

SpaceShooter.Level1.prototype = Object.create(SpaceShooter.Level.prototype);

SpaceShooter.Level1.prototype.constructor = SpaceShooter.Level1;

SpaceShooter.Level1.prototype.play = function () {

    var test = new SpaceShooter.Sparkles();
    test.init();
    test.add();
    test.object.position.x = 100;
    test.object.position.y = 100;
    test.object.visible = true;

    var background = new SpaceShooter.Background();
    background.init(this.resources.background.texture);
    background.add();
    for (var i = 0; i < 50; i++) {
        var star = new SpaceShooter.Star();
        star.init();
        star.add();
    }
    //COUCHFRIENDS.connect();
    testShip = new SpaceShooter.Ship();
    testShip.init();
    testShip.add();
    window.addEventListener('mousemove', function (e) {
        testShip.object.position.x = e.clientX;
        testShip.object.position.y = e.clientY;
    });
    window.addEventListener('mousedown', function (e) {
        testShip.shooting = true;
    });
    window.addEventListener('mouseup', function (e) {
        testShip.shooting = false;
    });
    setInterval(function() {
        var enemy = new SpaceShooter.EnemyUfo();
        enemy.init();
        enemy.tween = new TWEEN.Tween({x: (renderer.width - 100), y: -100})
            .to({
                x: [(renderer.width - 100), (renderer.width * .5), (renderer.width * .5)],
                y: [(renderer.height * .25), -100, (renderer.height + 100)]
            }, 10000)
            .onUpdate(function (p, tween) {
                tween.parent.object.position.x = this.x;
                tween.parent.object.position.y = this.y;

            })
            .interpolation(TWEEN.Interpolation.Bezier)
            .repeat(0)
            .onComplete(function () {
                enemy.remove();
            })
            .start();
        enemy.tween.parent = enemy;
        enemy.add();
    }, 1000);

    var enemy = new SpaceShooter.EnemyUfo();
    enemy.init();
    enemy.tween = new TWEEN.Tween({x: (renderer.width - 500), y: -50})
        .to({
            x: [(renderer.width - 500), (renderer.width * .5), (renderer.width * .5)],
            y: [(renderer.height * .25), -100, (renderer.height + 100)]
        }, 10000)
        .onUpdate(function (p, tween) {
            tween.parent.object.position.x = this.x;
            tween.parent.object.position.y = this.y;

        })
        .interpolation(TWEEN.Interpolation.Bezier)
        .repeat(0)
        .onComplete(function () {
            enemy.remove();
        })
        .start();
    enemy.tween.parent = enemy;
    enemy.add();

};