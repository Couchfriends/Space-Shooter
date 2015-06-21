/**
 * Created by Casmo on 17-6-2015.
 */
window.onload = init;
var renderer, stage, players = [], testShip, explosionSparkles = [], explosionSparklesCount = 0,hitSparkles = [], hitSparklesCount = 0;

function init() {
    COUCHFRIENDS.settings.host = 'ws.couchfriends.com';
    COUCHFRIENDS.settings.port = '1234';
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 800);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 600);
    SpaceShooter.settings.width = w;
    SpaceShooter.settings.height = h;
    renderer = new PIXI.autoDetectRenderer(w, h);
    stage = new PIXI.Container(0x000000);
    document.getElementById('game').innerHTML = '';
    document.getElementById('game').appendChild(renderer.view);
    var background = new SpaceShooter.Background();
    background.init();
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
    var enemy = new SpaceShooter.EnemyUfo();
    enemy.init();
    enemy.tween = new TWEEN.Tween({x: (renderer.width - 100), y: -100})
        .to({
            x: [(renderer.width - 100), (renderer.width * .5), (renderer.width * .5)],
            y: [(renderer.height * .25), -100, (renderer.height + 100)]
        }, 10000)
        .onUpdate(function () {

            enemy.object.position.x = this.x;
            enemy.object.position.y = this.y;

        })
        .interpolation(TWEEN.Interpolation.Bezier)
        .repeat(0)
        .onComplete(function () {
            enemy.remove();
        })
        .start();
    enemy.add();

    for (var i = 0; i < 15; i++) {
        var sparkle = new SpaceShooter.Sparkles();
        sparkle.init();
        sparkle.add();
        sparkle.object.visible = false;
        explosionSparkles.push(sparkle);
    }
    for (var i = 0; i < 25; i++) {
        var sparkle = new SpaceShooter.Sparkles();
        sparkle.stats = {
            particlesCount: 5,
            size: {
                min: .1,
                max: .9
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
        hitSparkles.push(sparkle);
    }
    requestAnimationFrame(update);
}

function addExplosionSparkles(x, y) {
    if (explosionSparkles[explosionSparklesCount].object.visible == true) {
        return false;
    }
    explosionSparkles[explosionSparklesCount].object.position.x = x;
    explosionSparkles[explosionSparklesCount].object.position.y = y;
    explosionSparkles[explosionSparklesCount].object.visible = true;
    explosionSparklesCount++;
    if (explosionSparklesCount >= explosionSparkles.length) {
        explosionSparklesCount = 0;
    }
}

function addHitSparkles(x, y) {
    if (hitSparkles[hitSparklesCount].object.visible == true) {
        return false;
    }
    hitSparkles[hitSparklesCount].object.position.x = x;
    hitSparkles[hitSparklesCount].object.position.y = y;
    hitSparkles[hitSparklesCount].object.visible = true;
    hitSparklesCount++;
    if (hitSparklesCount >= hitSparkles.length) {
        hitSparklesCount = 0;
    }
}

function update(time) {
    requestAnimationFrame(update);
    SpaceShooter.update(time);
    TWEEN.update(time);
    renderer.render(stage);
}

COUCHFRIENDS.on('playerJoined', function (data) {
    var playerShip = new SpaceShooter.Ship();
    playerShip.add();
    var player = {
        ship: playerShip,
        id: data.id
    };
    players.push(player);

    var jsonData = {
        topic: 'player',
        action: 'identify',
        data: {
            id: data.id,
            color: playerShip.tint
        }
    };
    COUCHFRIENDS.send(jsonData);
});

COUCHFRIENDS.on('playerOrientation', function (data) {

    for (var i = 0; i < players.length; i++) {
        if (players[i].id == data.id) {
            players[i].ship.setSpeed((data.x * players[i].ship.maxSpeed), (data.y * players[i].ship.maxSpeed));
            return;
        }
    }

});

COUCHFRIENDS.on('playerClickDown', function (data) {

    for (var i = 0; i < players.length; i++) {
        if (players[i].id == data.id) {
            players[i].ship.shooting = true;
            return;
        }
    }

});

COUCHFRIENDS.on('playerClickUp', function (data) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == data.id) {
            players[i].ship.shooting = false;
            return;
        }
    }

});

COUCHFRIENDS.on('playerClick', function (data) {
    return;
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == data.id) {
            players[i].ship.shooting = false;
            return;
        }
    }

});

COUCHFRIENDS.on('playerLeft', function (data) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == data.id) {
            players[i].ship.remove();
            players.splice(i, 1);
            return;
        }
    }
});

COUCHFRIENDS.on('connect', function () {
    var jsonData = {
        topic: 'game',
        action: 'host',
        data: {
            sessionKey: 'space-1234'
        }
    };
    COUCHFRIENDS.send(jsonData);
});

// Move extern.
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}