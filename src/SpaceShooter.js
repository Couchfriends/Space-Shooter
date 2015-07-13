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
var SpaceShooter = {
    settings: {
        width: 1024,
        height: 1024,
        assetsDir: 'assets/'
    },
    objects: [],
    scoreCurrency: '', // Prefix for score. e.g. € or $
    score: 0,
    lives: 5,
    lifeDudes: [],
    LightPos: [
        -.5,
        0,
        .5
    ],
    update: function (time) {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].update(time);
        }
    },

    addScore: function (score, x, y) {
        if (players.length >= 3) {
            achievements.teamEffort += score;
            if (achievements.hasTeamEffort == false && achievements.teamEffort > 25000) {
                // Unlock achievement for all players
                achievements.hasTeamEffort = true;
                for (var i = 0; i < players.length; i++) {
                    var jsonData = {
                        topic: 'game',
                        action: 'achievementUnlock',
                        data: {
                            playerId: players[i].id,
                            key: 'team_effort'
                        }
                    };
                    COUCHFRIENDS.send(jsonData);
                }
            }
        }
        this.score += score;

        if (x != null && y != null) {
            // Spawn text
            SpaceShooter.Tools.addScore(x,y,score);
        }
    },
    removeLife: function() {
        // Remove life and reset everything if lives < 0
        this.lives--;
        if (this.lives < 0) {
            this.score = 0;
            this.lives = 5;
            for (var i = 0; i < this.lifeDudes.length; i++) {
                this.lifeDudes[i].visible = true;
            }
            // Reset achievements
            resetAchievements();
        }
        else {
            this.lifeDudes[this.lives].visible = false;
        }
        this.level.reset();
    }
};

/**
 * Global object class
 * @constructor
 */
SpaceShooter.Element = function () {

    /**
     * Pixi.js object
     * @type {{}}
     */
    this.object = {};

    this.children = []; // Child objects

    /**
     * The name/type of the object. Used for collision detection
     * @type {string}
     */
    this.name = '';

    /**
     * Tween object
     * @type {{}}
     */
    this.tween = {};

    /**
     * Hit area for the object. Can be circle, polygon, react
     * @type {{}}
     */
    this.hitArea = null;

    /**
     * List of names that can collide with this object. Only one way needed.
     * @type {Array}
     */
    this.collisionList = [];

    this._textureCount = 0;

    /**
     * List with textures for this object. If this object has multiple textures it will animate (switch) between them
     * @type {Array}
     */
    this.textures = [];

    this.textureSpeed = 3;

    this.resetAfterLastTexture = false;

    /**
     * List with normal map textures for this object. If this object has multiple textures it will animate (switch) between them
     * @type {Array}
     */
    this.texturesNormals = [];

    /**
     * Aditional tint colors for the object to create variations of the same object
     * @type {{}}
     */
    this.tint = null;

    /**
     * Size of the object. Will be override by init function. Used for collision detection
     * @type {{height: number, width: number}}
     */
    this.size = {
        width: 0,
        height: 0
    }
};

SpaceShooter.Element.prototype = {

    init: function (textures) {

        if (textures == null) {
            for (var i = 0; i < this.textures.length; i++) {
                this.textures[i] = PIXI.Texture.fromImage(SpaceShooter.settings.assetsDir + this.textures[i]);
            }
        }
        else {
            this.textures = textures;
        }
        this.object = new PIXI.Sprite(this.textures[0]);
        this.object.anchor.x = 0.5;
        this.object.anchor.y = 0.5;
        if (this.hitArea != null) {
            this.object.hitArea = this.hitArea;
        }
        if (this.size.width == 0) {
            this.size.width = this.object.width;
        }
        if (this.size.height == 0) {
            this.size.height = this.object.height;
        }
        if (this.tint != null) {
            this.object.tint = this.tint;
        }

    },

    reset: function() {

    },

    add: function () {
        SpaceShooter.objects.push(this);
        if (this.object != null) {
            stage.addChild(this.object);
        }
    },

    addChild: function (element) {
        this.children.push(element);
    },

    remove: function () {
        if (this.object != null) {
            stage.removeChild(this.object);
        }
        if (this.tween != null) {
            TWEEN.remove(this.tween);
        }
        var indexOf = SpaceShooter.objects.indexOf(this);
        SpaceShooter.objects.splice(indexOf, 1);
        this.onRemove();
    },

    onRemove: function() {

    },

    /**
     * Update function in gameloop. Might return false if update is not allowed.
     * @param time
     * @returns {boolean}
     */
    update: function (time) {
        if (this.object.visible == false) {
            return false;
        }
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].update();
        }
        if (this.textures.length > 1 && time%this.textureSpeed<1) {
            // Animate
            this._textureCount++;
            if (this._textureCount >= this.textures.length) {
                this._textureCount = 0;
                if (this.resetAfterLastTexture == true) {
                    this.reset();
                }
            }
            this.object.texture = this.textures[this._textureCount];
        }

        // Do some collision detection here
        var collisionObject = this.checkCollision();
        if (collisionObject != false) {
            this.collision(collisionObject);
            this.reset();
        }
    },

    /**
     * Collision detection
     */
    checkCollision: function () {
        if (this.collisionList.length == 0) {
            return false;
        }
        for (var i = 0; i < SpaceShooter.objects.length; i++) {
            var object = SpaceShooter.objects[i];
            if (object.name == '' || this.collisionList.indexOf(object.name) < 0) {
                continue;
            }
            if (object.object.hitArea != null) {
                // Get bounds, not just the center
                var minX = this.object.position.x - (object.object.position.x - (this.object.width / 2));
                var minY = this.object.position.y - (object.object.position.y - (this.object.height / 2));

                var maxX = this.object.position.x - (object.object.position.x + (this.object.width / 2));
                var maxY = this.object.position.y - (object.object.position.y + (this.object.height / 2));
                if (object.object.hitArea.contains(minX, minY) || object.object.hitArea.contains(minX, maxY) || object.object.hitArea.contains(maxX, minY) || object.object.hitArea.contains(maxX, maxY)) {
                    return object;
                }

                var x = this.object.position.x - (object.object.position.x - (object.size.width / 2));
                var y = this.object.position.y - (object.object.position.y - (object.size.height / 2));
                if (object.object.hitArea.contains(x, y)) {
                    return object;
                }
            }
            else {
                // Simple AABB collision detection
                var xdist = object.object.position.x - this.object.position.x;

                if (xdist > -(object.object.width+this.object.width) / 2 && xdist < (object.object.width+this.object.width) / 2) {
                    var ydist = object.object.position.y - this.object.position.y;

                    if (ydist > -(object.object.height+this.object.height) / 2 && ydist < (object.object.height+this.object.height) / 2) {
                        return object;
                    }
                }
            }
        }
        return false;
    },

    /**
     * Callback when an object hit this object
     * @param target
     */
    collision: function (target) {

    },

    destroy: function () {
        this.remove();
    }
};