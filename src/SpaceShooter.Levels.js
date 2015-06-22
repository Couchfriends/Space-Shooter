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

    /**
     * List with spawning elements based on `time` of the update() function
     * @type {array}
     */
    this.elements = [];

    this.maxElements = 25;
    this.spawnFrequency = 250; // Per how much frames?
    this.elementsPerPlayer = .75; // The lower the faster the spawn rate
    this.nextElementPerScore = 1000; // Difficulty increased per this score
    this._spawnCounter = 0;
    this._nextSpawn = 150;
    this._elementsSpawned = 0;

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
        SpaceShooter.objects.push(loader.level);
        SpaceShooter.Tools.init(resources);
    });
};

SpaceShooter.Level.prototype.update = function(time) {
    if (this.elements.length > this.maxElements) {
        return;
    }
    if (this._spawnCounter < this._nextSpawn) {
        this._spawnCounter++;
        return;
    }
    this.spawnElement();
    this._spawnCounter = 0;
};

SpaceShooter.Level.prototype.play = function () {
    console.log('Play what? Thin air?');
};

/**
 * Spawns a new (enemy) element and set the new this._nextSpawn number
 */
SpaceShooter.Level.prototype.spawnElement = function() {

    this._elementsSpawned++;
    var enemy = new SpaceShooter.EnemyUfo();
    enemy.level = this;
    var startX = 100 + (Math.random() * (renderer.width - 200));
    var endX = 100 + (Math.random() * (renderer.width - 200));
    enemy.init();
    enemy.object.position.x = startX;
    enemy.object.position.y = -100;
    enemy.tween = new TWEEN.Tween({x: startX, y: -100})
        .to({
            x: [startX, endX, endX],
            y: [(renderer.height * .25), -100, (renderer.height + 100)]
        }, 10000)
        .onUpdate(function (p, tween) {
            tween.element.object.position.x = this.x;
            tween.element.object.position.y = this.y;

        })
        .interpolation(TWEEN.Interpolation.Bezier)
        .repeat(0)
        .onComplete(function (tween) {
            tween.element.tween = null; // Is already gone in TWEEN
            tween.element.remove();
        })
        .start();
    enemy.tween.element = enemy;
    enemy.add();
    enemy.onRemove = function() {
        var indexOf = this.level.elements.indexOf(this);
        this.level.elements.splice(indexOf, 1);
    };
    this.elements.push(enemy);
    // Calculate the next spawn based on score, number of players
    this._nextSpawn = this.spawnFrequency;
    for (var i = 0; i < players.length; i++) {
        this._nextSpawn *= this.elementsPerPlayer;
    }
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

    var background = new SpaceShooter.Background();
    background.init(this.resources.background.texture);
    background.add();
    for (var i = 0; i < 200; i++) {
        var star = new SpaceShooter.Star();
        star.init();
        star.add();
    }
    COUCHFRIENDS.connect();
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

    //var enemy = new SpaceShooter.EnemyUfo();
    //enemy.init();
    //enemy.tween = new TWEEN.Tween({x: (renderer.width - 500), y: -50})
    //    .to({
    //        x: [(renderer.width - 500), (renderer.width * .5), (renderer.width * .5)],
    //        y: [(renderer.height * .25), -100, (renderer.height + 100)]
    //    }, 10000)
    //    .onUpdate(function (p, tween) {
    //        tween.parent.object.position.x = this.x;
    //        tween.parent.object.position.y = this.y;
    //
    //    })
    //    .interpolation(TWEEN.Interpolation.Bezier)
    //    .repeat(0)
    //    .onComplete(function (tween) {
    //        tween.parent.remove();
    //    })
    //    .start();
    //enemy.tween.parent = enemy;
    //enemy.add();

};