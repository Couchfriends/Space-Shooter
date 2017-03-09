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
 *
 * Created in honor of New Horizons. https://www.nasa.gov/mission_pages/newhorizons/main/index.html
 */
window.onload = init;
var renderer, stage, players = [], sounds = [], achievements = {};
function resetAchievements() {
    achievements.teamEffort = 0;
    achievements.hasTeamEffort = false;
    achievements.bulletHits = false;
    achievements.ufosKilled = 0;
    achievements.asteroidsKilled = 0;
}
resetAchievements();

function init() {
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
    SpaceShooter.level = level;
    stage.updateLayersOrder();
    requestAnimationFrame(update);
}

function update(time) {
    requestAnimationFrame(update);
    SpaceShooter.update(time);
    TWEEN.update(time);
    renderer.render(stage);
}

COUCHFRIENDS.on('player.join', function (data) {
    var playerShip = new SpaceShooter.Ship();
    playerShip.init();
    playerShip.add();
    var player = {
        id: data.peer,
        ship: playerShip,
        score: 0
    };
    playerShip.playerId = data.id;
    players.push(player);

    stage.updateLayersOrder();

    if (players.length <= 3) {
        achievements.teamEffort = 0;
    }
});

COUCHFRIENDS.on('player.orientation', function (data) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == data.player.id) {
            players[i].ship.setSpeed(
                (data.x * (players[i].ship.maxSpeed *.3)),
                (data.y * (players[i].ship.maxSpeed *.3))
            );
            return;
        }
    }
});

COUCHFRIENDS.on('player.identify', function (data) {
    if (data.color == null) {
        return;
    }
    var color = data.color.replace(/#/, '0x');
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == data.player.id) {
            players[i].color = players[i].ship.tint = players[i].ship.originalTint = players[i].ship.object.tint = color;
            for (var b = 0; b < players[i].ship.bullets.length; b++) {
                console.log(players[i].ship.bullets[b]);
                players[i].ship.bullets[b].color = players[i].ship.bullets[b].object.tint = color;
            }
            return;
        }
    }
});

COUCHFRIENDS.on('player.clickDown', function (data) {

    for (var i = 0; i < players.length; i++) {
        if (players[i].id == data.player.id) {
            players[i].ship.shooting = true;
            return;
        }
    }

});

COUCHFRIENDS.on('player.clickUp', function (data) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == data.player.id) {
            players[i].ship.shooting = false;
            return;
        }
    }

});

COUCHFRIENDS.on('player.buttonDown', function (data) {

    for (var i = 0; i < players.length; i++) {
        if (players[i].id == data.player.id) {
            players[i].ship.shooting = true;
            return;
        }
    }

});

COUCHFRIENDS.on('player.buttonUp', function (data) {

    for (var i = 0; i < players.length; i++) {
        if (players[i].id == data.player.id) {
            players[i].ship.shooting = false;
            return;
        }
    }

});

COUCHFRIENDS.on('player.buttonClick', function (data) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == data.player.id) {
            players[i].ship.shooting = false;
            return;
        }
    }
});

COUCHFRIENDS.on('player.left', function (data) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == data.player.id) {
            players[i].ship.remove();
            players.splice(i, 1);
            return;
        }
    }
    if (players.length < 3) {
        achievements.teamEffort = 0;
    }
});

// COUCHFRIENDS.on('connect', function () {
//     var jsonData = {
//         topic: 'game',
//         action: 'host',
//         data: {
//             sessionKey: 'space-1234'
//         }
//     };
//     COUCHFRIENDS.send(jsonData);
// });

function vibrate(playerId, duration) {
    duration = duration || 200;
    var jsonData = {
        topic: 'interface.vibrate',
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

Array.prototype.shuffle = function() {
    var i = this.length, j, temp;
    if ( i == 0 ) return this;
    while ( --i ) {
        j = Math.floor( Math.random() * ( i + 1 ) );
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
};
window.performance = window.performance || {};
performance.now = (function() {
    return performance.now       ||
        performance.mozNow    ||
        performance.msNow     ||
        performance.oNow      ||
        performance.webkitNow ||
        function() { return new Date().getTime(); };
})();