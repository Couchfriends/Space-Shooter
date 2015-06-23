/**
 * Created by Casmo on 17-6-2015.
 */
window.onload = init;
var renderer, stage, players = [], testShip;

function init() {
    COUCHFRIENDS.settings.host = 'ws.couchfriends.com';
    COUCHFRIENDS.settings.port = '1234';
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 800);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 600);
    SpaceShooter.settings.width = w;
    SpaceShooter.settings.height = h;
    renderer = new PIXI.autoDetectRenderer(w, h);
    stage = new PIXI.Container(0x000000);
    stage.updateLayersOrder = function () {
        stage.children.sort(function(a,b) {
            a.zIndex = a.zIndex || 11; // 0-10 is for backgrounds
            b.zIndex = b.zIndex || 11; // 0-10 is for backgrounds
            return a.zIndex - b.zIndex
        });
    };
    document.getElementById('game').innerHTML = '';
    document.getElementById('game').appendChild(renderer.view);
    var level = new SpaceShooter.Level1();
    level.start();
    stage.updateLayersOrder();
    requestAnimationFrame(update);
}

function update(time) {
    requestAnimationFrame(update);
    SpaceShooter.update(time);
    TWEEN.update(time);
    renderer.render(stage);
}

COUCHFRIENDS.on('playerJoined', function (data) {
    var playerShip = new SpaceShooter.Ship();
    playerShip.init();
    playerShip.add();
    var player = {
        id: data.id,
        ship: playerShip,
        score: 0
    };
    playerShip.playerId = data.id;
    players.push(player);

    var jsonData = {
        topic: 'player',
        action: 'identify',
        data: {
            id: data.id,
            color: playerShip.tint.replace('0x', '#')
        }
    };
    COUCHFRIENDS.send(jsonData);
    stage.updateLayersOrder();
});

COUCHFRIENDS.on('playerOrientation', function (data) {

    //data.y -= .5;
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

function vibrate(playerId, duration) {
    duration = duration || 200;
    var jsonData = {
        topic: 'interface',
        action: 'vibrate',
        data: {
            playerId: playerId,
            duration: duration
        }
    };
    COUCHFRIENDS.send(jsonData);
}

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