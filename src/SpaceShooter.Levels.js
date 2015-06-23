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
    this.elementsPerPlayer = .75; // The lower the faster the spawn rate. Must be less then one
    this.nextDifficultyIncreased = 500; // Difficulty increased per this score
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

    if (players.length == -1) { // Make 0 on end
        return;
    }
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
    //COUCHFRIENDS.connect();
    var x = 20;
    var dudeTexture = PIXI.Texture.fromImage(SpaceShooter.settings.assetsDir + 'life.png');
    for (var i = 0; i < SpaceShooter.lives; i++) {
        var life = new PIXI.Sprite(dudeTexture);
        life.position.y = 20;
        life.position.x = x;
        life.zIndex = 99;
        life.anchor.x = 0;
        life.anchor.y = 0;
        SpaceShooter.lifeDudes.push(life);
        x += 26;
        stage.addChild(life);

    }
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

    var score = new SpaceShooter.TextScore();
    score.init();
    score.object.position.x = renderer.width - 20;
    score.object.position.y = 20;
    score.add();

    stage.updateLayersOrder();

};