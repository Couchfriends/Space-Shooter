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
SpaceShooter.Level = function () {

    this.name = 'Level name';
    this.description = 'Level description';
    /**
     * All assets objects with {name: 'name', file: 'asset.jpg'}
     * @type {Array}
     */
    this.assets = [];

    this.sounds = [];

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
    this.nextDifficultyIncreased = 250; // Difficulty increased per this score
    this.difficultyIncreaseMultipler = 2.1;
    this.difficultNumber = 1;
    this.maxDifficultNumber = 7;
    this._spawnCounter = 0;
    this._nextSpawn = 150;
    this._elementsSpawned = 0;

};

SpaceShooter.Level.prototype.constructor = SpaceShooter.Level;

SpaceShooter.Level.prototype.reset = function () {

    this.nextDifficultyIncreased = 250; // Difficulty increased per this score
    this.difficultNumber = 1;
    for (var i = 0; i < players.length; i++) {
        players[i].ship.bulletLevel = 1;
    }

};
/**
 * Loads all assets and play() after loading is complete
 */
SpaceShooter.Level.prototype.start = function () {

    Howler.volume(.5);
    for (var i = 0; i < this.sounds.length; i++) {
        var sound = new Howl({
            src: [SpaceShooter.settings.assetsDir + this.sounds[i].file],
            autoplay: this.sounds[i].autoplay || false,
            buffer: false,
            volume: this.sounds[i].volume || 1,
            loop: this.sounds[i].loop || false
        });
        sounds[this.sounds[i].name] = sound;
    }

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

    if (players.length == 0) {
        return;
    }
    this._elementsSpawned++;
    if (this.difficultNumber >= 1 && this.difficultNumber <= 3 || this.difficultNumber > this.maxDifficultNumber) {
        var enemy = new SpaceShooter.EnemyAsteroid();
        var startX = 100 + (Math.random() * (renderer.width - 200));
        var endX = startX;
        enemy.init();
        enemy.stats.hp += this.difficultNumber;
        enemy.stats.score += (this.difficultNumber * 10);
        enemy.object.position.x = startX;
        enemy.object.position.y = -100;
        enemy.rotationSpeed = getRandom(-.02, .02);
        enemy.tween = new TWEEN.Tween({x: startX, y: -100})
            .to({
                x: endX,
                y: (renderer.height + 100)
            }, 12000)
            .onUpdate(function (p, tween) {
                tween.element.object.position.x = this.x;
                tween.element.object.position.y = this.y;
                tween.element.object.rotation += tween.element.rotationSpeed;

            })
            .onComplete(function (tween) {
                tween.element.tween = null; // Is already gone in TWEEN
                tween.element.remove();
            })
            .start();
        enemy.tween.element = enemy;
        enemy.add();
        enemy.onRemove = function () {
            var indexOf = this.level.elements.indexOf(this);
            this.level.elements.splice(indexOf, 1);
        };
        enemy.level = this;
        this.elements.push(enemy);
    }
    if (this.difficultNumber >= 3 && this.difficultNumber <= 5 || this.difficultNumber > this.maxDifficultNumber) {
        var enemy = new SpaceShooter.EnemyUfo();
        var startX = 100 + (Math.random() * (renderer.width - 200));
        var endX = 100 + (Math.random() * (renderer.width - 200));
        enemy.init();
        enemy.stats.hp += this.difficultNumber;
        enemy.stats.score += (this.difficultNumber * 10);
        enemy.object.position.x = startX;
        enemy.object.position.y = -100;
        enemy.rotationSpeed = getRandom(-.025, .025);
        enemy.tween = new TWEEN.Tween({x: startX, y: -100})
            .to({
                x: [startX, endX, endX],
                y: [(renderer.height * .25), -100, (renderer.height + 100)]
            }, 15000)
            .onUpdate(function (p, tween) {
                tween.element.object.position.x = this.x;
                tween.element.object.position.y = this.y;
                tween.element.object.rotation += tween.element.rotationSpeed;

            })
            .interpolation(TWEEN.Interpolation.Bezier)
            .onComplete(function (tween) {
                tween.element.tween = null; // Is already gone in TWEEN
                tween.element.remove(); // We should reset it instead of creating a new one
            })
            .start();
        enemy.tween.element = enemy;
        enemy.add();
        enemy.onRemove = function () {
            var indexOf = this.level.elements.indexOf(this);
            this.level.elements.splice(indexOf, 1);
        };
        enemy.level = this;
        this.elements.push(enemy);
    }
    if (this.difficultNumber >= 5 && this.difficultNumber <= 7 || this.difficultNumber > this.maxDifficultNumber) {
        var enemy = new SpaceShooter.EnemyUfo();
        enemy.stats.color = 0xff0000;
        var startX = 100 + (Math.random() * (renderer.width - 200));
        var endX = 100 + (Math.random() * (renderer.width - 200));
        enemy.bulletCounter = 100;
        enemy.stats.hp = 10;
        enemy.stats.score = 125;
        enemy.stats.hp += this.difficultNumber;
        enemy.stats.score += (this.difficultNumber * 10);
        enemy.init();
        enemy.object.position.x = startX;
        enemy.object.position.y = -100;
        enemy.object.tint = 0xff0000;
        enemy.rotationSpeed = getRandom(-.025, .025);
        enemy.tween = new TWEEN.Tween({x: startX, y: -100})
            .to({
                x: [startX, endX, endX],
                y: [(renderer.height * .25), -100, (renderer.height + 100)]
            }, 20000)
            .onUpdate(function (p, tween) {
                tween.element.object.position.x = this.x;
                tween.element.object.position.y = this.y;
                tween.element.object.rotation += tween.element.rotationSpeed;

            })
            .interpolation(TWEEN.Interpolation.Bezier)
            .onComplete(function (tween) {
                tween.element.tween = null; // Is already gone in TWEEN
                tween.element.remove(); // We should reset it instead of creating a new one
            })
            .start();
        enemy.tween.element = enemy;
        enemy.add();
        enemy.onRemove = function () {
            var indexOf = this.level.elements.indexOf(this);
            this.level.elements.splice(indexOf, 1);
        };
        enemy.level = this;
        this.elements.push(enemy);
    }
    if (this.difficultNumber>=6) {
        var enemy = new SpaceShooter.EnemyBigShip();
        enemy.init();
        enemy.object.position.x = startX;
        enemy.object.position.y = -250;
        enemy.tween = new TWEEN.Tween({x: startX, y: -250})
            .to({
                x: startX,
                y: renderer.height + 250
            }, 21000)
            .onUpdate(function (p, tween) {
                tween.element.object.position.x = this.x;
                tween.element.object.position.y = this.y;

            })
            .interpolation(TWEEN.Interpolation.Bezier)
            .onComplete(function (tween) {
                tween.element.tween = null; // Is already gone in TWEEN
                tween.element.remove(); // We should reset it instead of creating a new one
            })
            .start();
        enemy.tween.element = enemy;
        enemy.add();
        enemy.onRemove = function () {
            var indexOf = this.level.elements.indexOf(this);
            this.level.elements.splice(indexOf, 1);
        };
        enemy.level = this;
        this.elements.push(enemy);
    }
    // Calculate the next spawn based on score, number of players
    this._nextSpawn = this.spawnFrequency;
    for (var i = 0; i < players.length; i++) {
        this._nextSpawn *= this.elementsPerPlayer;
    }
    if (SpaceShooter.score >= this.nextDifficultyIncreased) {
        this.nextDifficultyIncreased *= this.difficultyIncreaseMultipler;
        this.difficultNumber++;
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
    this.sounds = [
        {
            name: 'sound-background',
            file: 'sound-background.mp3',
            loop: true,
            autoplay: true
        },
        {
            name: 'sound-explosion001',
            file: 'sound-explosion001.wav'
        },
        {
            name: 'sound-explosion002',
            file: 'sound-explosion002.wav'
        },
        {
            name: 'sound-bonus',
            file: 'sound-bonus.wav'
        },
        {
            name: 'sound-impact',
            file: 'sound-impact.wav',
            volume:.25
        },
        {
            name: 'sound-laser',
            file: 'sound-laser.wav',
            volume:.25
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
    var x = renderer.width - 20;
    var dudeTexture = PIXI.Texture.fromImage(SpaceShooter.settings.assetsDir + 'life.png');
    for (var i = 0; i < SpaceShooter.lives; i++) {
        var life = new PIXI.Sprite(dudeTexture);
        life.position.y = 60;
        life.position.x = x;
        life.zIndex = 99;
        life.anchor.x = 1;
        life.anchor.y = 0;
        SpaceShooter.lifeDudes.push(life);
        x -= 26;
        stage.addChild(life);

    }
    //
    //testShip = new SpaceShooter.Ship();
    //testShip.init();
    //testShip.add();
    //var player = {
    //    id: 123,
    //    ship: testShip
    //};
    //players.push(player);
    //window.addEventListener('mousemove', function (e) {
    //    testShip.object.position.x = e.clientX;
    //    testShip.object.position.y = e.clientY;
    //});
    //window.addEventListener('mousedown', function (e) {
    //    testShip.shooting = true;
    //});
    //window.addEventListener('mouseup', function (e) {
    //    testShip.shooting = false;
    //});
    //window.addEventListener('keyup', function (e) {
    //    if (e.key == null) {
    //        return;
    //    }
    //    if (e.key == 'm') {
    //        soundMuteUnmute();
    //    }
    //    if (e.key == '+') {
    //        soundIncreaseVolume();
    //    }
    //    if (e.key == '-') {
    //        soundDecreaseVolume();
    //    }
    //});
    document.getElementById('sound-mute').addEventListener('click', function(e) {
        soundMuteUnmute();
    }, false);
    document.getElementById('sound-volume-down').addEventListener('click', function(e) {
        soundDecreaseVolume();
    }, false);
    document.getElementById('sound-volume-up').addEventListener('click', function(e) {
        soundIncreaseVolume();
    }, false);

    var score = new SpaceShooter.TextScore();
    score.init();
    score.object.position.x = renderer.width - 20;
    score.object.position.y = 20;
    score.add();

    stage.updateLayersOrder();
    varClearTimeout = setTimeout(function() {document.getElementById('ui').className = 'fadeOut';}, 5000);

};
var varClearTimeout = 0;
function soundMuteUnmute() {
    clearTimeout(varClearTimeout);
    var mute = true;
    if (Howler._muted == true) {
        mute = false;
    }
    Howler.mute(mute);
    document.getElementById('ui').className = 'fadeIn';
    varClearTimeout = setTimeout(function() {document.getElementById('ui').className = 'fadeOut';}, 5000);
}

function soundDecreaseVolume() {
    clearTimeout(varClearTimeout);
    var volume = Howler._volume;
    if (volume > 0) {
        volume -= .1;
    }
    Howler.mute(false);
    Howler.volume(volume);
    document.getElementById('ui').className = 'fadeIn';
    varClearTimeout = setTimeout(function() {document.getElementById('ui').className = 'fadeOut';}, 5000);
}

function soundIncreaseVolume() {
    clearTimeout(varClearTimeout);
    var volume = Howler._volume;
    if (volume < 1) {
        volume += .1;
    }
    Howler.mute(false);
    Howler.volume(volume);
    document.getElementById('ui').className = 'fadeIn';
    varClearTimeout = setTimeout(function() {document.getElementById('ui').className = 'fadeOut';}, 5000);
}