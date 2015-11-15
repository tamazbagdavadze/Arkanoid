var Arkanoid;
(function (Arkanoid) {
    (function (_3DObjectTypes) {
        _3DObjectTypes[_3DObjectTypes["Block"] = 1] = "Block";
        _3DObjectTypes[_3DObjectTypes["Wall"] = 2] = "Wall";
        _3DObjectTypes[_3DObjectTypes["Ball"] = 3] = "Ball";
        _3DObjectTypes[_3DObjectTypes["Player"] = 4] = "Player";
        _3DObjectTypes[_3DObjectTypes["MiniBlock"] = 5] = "MiniBlock";
    })(Arkanoid._3DObjectTypes || (Arkanoid._3DObjectTypes = {}));
    var _3DObjectTypes = Arkanoid._3DObjectTypes;
})(Arkanoid || (Arkanoid = {}));
var Arkanoid;
(function (Arkanoid) {
    (function (GameLevel) {
        GameLevel[GameLevel["One"] = 1] = "One";
        GameLevel[GameLevel["Two"] = 2] = "Two";
        GameLevel[GameLevel["Three"] = 3] = "Three";
        GameLevel[GameLevel["Four"] = 4] = "Four";
        GameLevel[GameLevel["Five"] = 5] = "Five";
        GameLevel[GameLevel["Six"] = 6] = "Six";
        GameLevel[GameLevel["Seven"] = 7] = "Seven";
    })(Arkanoid.GameLevel || (Arkanoid.GameLevel = {}));
    var GameLevel = Arkanoid.GameLevel;
})(Arkanoid || (Arkanoid = {}));
var Arkanoid;
(function (Arkanoid) {
    function make2DArray(width, height) {
        if (height === void 0) { height = null; }
        height = height == null ? width : height;
        var arr = Array(width);
        for (var i = 0; i < width; i++) {
            arr[i] = Array(height);
        }
        return arr;
    }
    Arkanoid.make2DArray = make2DArray;
    function make3DArray(n) {
        var arr = Array(n);
        for (var i = 0; i < n; i++) {
            arr[i] = Array(n);
            for (var j = 0; j < n; j++) {
                arr[i][j] = Array(n);
            }
        }
        return arr;
    }
    Arkanoid.make3DArray = make3DArray;
    function convert2DTo1DArray(arr) {
        var resultArr = Array(0);
        for (var i = 0; i < arr.length; i++) {
            var length_1 = arr[i].length;
            for (var j = 0; j < length_1; j++) {
                resultArr.push(arr[i][j]);
            }
        }
        return resultArr;
    }
    Arkanoid.convert2DTo1DArray = convert2DTo1DArray;
    function newDiv(id, className, size) {
        if (id === void 0) { id = ""; }
        if (className === void 0) { className = ""; }
        if (size === void 0) { size = undefined; }
        var div = document.createElement("div");
        div.id = id;
        div.className = className;
        if (size !== undefined && size !== null && isNaN(size) === false) {
            div.setAttribute("style", "width:" + size + "px; height:" + size + "px;");
        }
        return div;
    }
    Arkanoid.newDiv = newDiv;
    var Point2D = (function () {
        function Point2D(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        return Point2D;
    })();
    Arkanoid.Point2D = Point2D;
    var Point3D = (function () {
        function Point3D(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
        }
        return Point3D;
    })();
    Arkanoid.Point3D = Point3D;
})(Arkanoid || (Arkanoid = {}));
var Arkanoid;
(function (Arkanoid) {
    (function (Keys) {
        Keys[Keys["Left"] = 37] = "Left";
        Keys[Keys["Up"] = 38] = "Up";
        Keys[Keys["Right"] = 39] = "Right";
        Keys[Keys["Down"] = 40] = "Down";
    })(Arkanoid.Keys || (Arkanoid.Keys = {}));
    var Keys = Arkanoid.Keys;
})(Arkanoid || (Arkanoid = {}));
var Arkanoid;
(function (Arkanoid) {
    (function (Directions) {
        Directions[Directions["Forward"] = 1] = "Forward";
        Directions[Directions["Left"] = 2] = "Left";
        Directions[Directions["Up"] = 3] = "Up";
        Directions[Directions["Right"] = 4] = "Right";
        Directions[Directions["Down"] = 5] = "Down";
        Directions[Directions["Back"] = 6] = "Back";
    })(Arkanoid.Directions || (Arkanoid.Directions = {}));
    var Directions = Arkanoid.Directions;
})(Arkanoid || (Arkanoid = {}));
var Arkanoid;
(function (Arkanoid) {
    var Config = (function () {
        function Config(currentGameLevel, blockSize, currentPlayerStep, ballStepX, ballStepZ, lineWidth, playerStepDelay) {
            this.blockSize = blockSize;
            this.ballStepX = ballStepX;
            this.ballStepZ = ballStepZ;
            this.currentGameLevel = currentGameLevel;
            this.currentPlayerStep = currentPlayerStep;
            this.lineWidth = lineWidth;
            this.playerStepDelay = playerStepDelay;
        }
        Config.defualtConfig = new Config(Arkanoid.GameLevel.Two, 2, 0.2, 0.2, 0.2, 10, 0.5);
        Config.getDefaultConfig = function () {
            return Config.clone(Config.defualtConfig);
        };
        Config.clone = function (obj) {
            return new Config(obj.currentGameLevel, obj.blockSize, obj.currentPlayerStep, obj.ballStepX, obj.ballStepZ, obj.lineWidth, obj.playerStepDelay);
        };
        return Config;
    })();
    Arkanoid.Config = Config;
})(Arkanoid || (Arkanoid = {}));
/// <reference path="GameLevel.ts"/>
/// <reference path="Helpers.ts"/>
/// <reference path="KeyCodeEnum.ts"/>
/// <reference path="Directions.ts"/>
/// <reference path="Config.ts"/>
/// <reference path="3DObjectTypes.ts"/>
"use strict";
var Arkanoid;
(function (Arkanoid) {
    var ArkanoidGame = (function () {
        function ArkanoidGame(domElement) {
            var _this = this;
            this.gridColor = 0x006600;
            this.currentKeyTimeoutId = null;
            this.currentBallIntervalId = null;
            this.renderId = null;
            this.newGame = function (config) {
                if (config === void 0) { config = Arkanoid.Config.getDefaultConfig(); }
                if (_this.scene != null && _this.scene != undefined) {
                    for (var i = _this.scene.children.length - 1; i >= 0; i--) {
                        _this.scene.remove(_this.scene.children[i]);
                    }
                }
                _this.ballPrevPos = null;
                _this.currentKeyTimeoutId = null;
                _this.currentBallIntervalId = null;
                _this.currentConfig = config;
                _this.buildBlocks();
                _this.initPlayer();
                _this.initBall();
                _this.buildWalls();
                _this.addLight();
                _this.resetCamera();
                _this.render();
                _this.ballPrevPos = _this.ball.position.clone();
                _this.currentConfig.ballStepX = _this.randomStartStep();
                _this.currentConfig.ballStepZ = _this.randomStartStep() + 0.01;
                _this.start();
            };
            this.randomStartStep = function () {
                var n = Math.random();
                n = Math.floor(n * 10000);
                n = n % 0.08;
                if (Math.random() > 0.4) {
                    n = -n;
                }
                return n;
            };
            this.start = function () {
                _this.currentBallIntervalId = setInterval(function () {
                    _this.ball.position.x += _this.currentConfig.ballStepX;
                    _this.ball.position.z += _this.currentConfig.ballStepZ;
                    _this.onBallMove();
                }, 0);
            };
            this.onBallMove = function () {
                var collisionToBlockResult = _this.collisionToBlock();
                var ball = _this.ball;
                var ballPos = ball.position;
                var ballPrevPos = _this.ballPrevPos.clone();
                _this.ballPrevPos = ball.position.clone();
                var halfAreaSize = _this.currentConfig.lineWidth * _this.currentConfig.blockSize / 2;
                if (collisionToBlockResult.success && collisionToBlockResult.collision.object.userData.objectType === Arkanoid._3DObjectTypes.Player) {
                    clearInterval(_this.currentBallIntervalId);
                    _this.currentConfig.ballStepZ = -_this.currentConfig.ballStepZ;
                    _this.start();
                }
                else if (collisionToBlockResult.success) {
                    var block = collisionToBlockResult.collision.object;
                    var touchPoint = collisionToBlockResult.collision.point;
                    _this.breakBlock(block);
                    if (_this.isGameOver()) {
                        clearInterval(_this.currentBallIntervalId);
                        clearInterval(_this.currentKeyTimeoutId);
                        cancelAnimationFrame(_this.renderId);
                        ArkanoidGame.onEnd();
                        return;
                    }
                    if (ballPrevPos.x >= ballPos.x) {
                        if (ballPrevPos.z >= ballPos.z) {
                            if (touchPoint.x < ballPos.x) {
                                clearInterval(_this.currentBallIntervalId);
                                _this.currentConfig.ballStepX = -_this.currentConfig.ballStepX;
                                _this.start();
                            }
                            else {
                                clearInterval(_this.currentBallIntervalId);
                                _this.currentConfig.ballStepZ = -_this.currentConfig.ballStepZ;
                                _this.start();
                            }
                        }
                        else {
                            if (touchPoint.z > ballPos.z) {
                                clearInterval(_this.currentBallIntervalId);
                                _this.currentConfig.ballStepZ = -_this.currentConfig.ballStepZ;
                                _this.start();
                            }
                            else {
                                clearInterval(_this.currentBallIntervalId);
                                _this.currentConfig.ballStepX = -_this.currentConfig.ballStepX;
                                _this.start();
                            }
                        }
                    }
                    else {
                        if (ballPrevPos.z >= ballPos.z) {
                            if (touchPoint.x > ballPos.x) {
                                clearInterval(_this.currentBallIntervalId);
                                _this.currentConfig.ballStepX = -_this.currentConfig.ballStepX;
                                _this.start();
                            }
                            else {
                                clearInterval(_this.currentBallIntervalId);
                                _this.currentConfig.ballStepZ = -_this.currentConfig.ballStepZ;
                                _this.start();
                            }
                        }
                        else {
                            if (touchPoint.z > ballPos.z) {
                                clearInterval(_this.currentBallIntervalId);
                                _this.currentConfig.ballStepZ = -_this.currentConfig.ballStepZ;
                                _this.start();
                            }
                            else {
                                clearInterval(_this.currentBallIntervalId);
                                _this.currentConfig.ballStepX = -_this.currentConfig.ballStepX;
                                _this.start();
                            }
                        }
                    }
                }
                else {
                    if (ballPos.x <= -halfAreaSize) {
                        if (ballPrevPos.z > ballPos.z) {
                            clearInterval(_this.currentBallIntervalId);
                            _this.currentConfig.ballStepX = -_this.currentConfig.ballStepX;
                            _this.start();
                        }
                        else {
                            clearInterval(_this.currentBallIntervalId);
                            _this.currentConfig.ballStepX = -_this.currentConfig.ballStepX;
                            _this.start();
                        }
                    }
                    else if (ballPos.x > halfAreaSize) {
                        if (ballPrevPos.z > ballPos.z) {
                            clearInterval(_this.currentBallIntervalId);
                            _this.currentConfig.ballStepX = -_this.currentConfig.ballStepX;
                            _this.start();
                        }
                        else {
                            clearInterval(_this.currentBallIntervalId);
                            _this.currentConfig.ballStepX = -_this.currentConfig.ballStepX;
                            _this.start();
                        }
                    }
                    else if (ballPos.z <= -halfAreaSize) {
                        if (ballPrevPos.x > ballPos.x) {
                            clearInterval(_this.currentBallIntervalId);
                            _this.currentConfig.ballStepZ = -_this.currentConfig.ballStepZ;
                            _this.start();
                        }
                        else {
                            clearInterval(_this.currentBallIntervalId);
                            _this.currentConfig.ballStepZ = -_this.currentConfig.ballStepZ;
                            _this.start();
                        }
                    }
                    else if (ballPos.z > halfAreaSize - 0.4) {
                        clearInterval(_this.currentBallIntervalId);
                        clearInterval(_this.currentKeyTimeoutId);
                        cancelAnimationFrame(_this.renderId);
                        ArkanoidGame.onEnd();
                    }
                }
            };
            this.collisionToBlock = function () {
                var collisions;
                var blocks = Arkanoid.convert2DTo1DArray(_this.blocks);
                var rays = [
                    new THREE.Vector3(0, 0, 1),
                    new THREE.Vector3(1, 0, 1),
                    new THREE.Vector3(1, 0, 0),
                    new THREE.Vector3(1, 0, -1),
                    new THREE.Vector3(0, 0, -1),
                    new THREE.Vector3(-1, 0, -1),
                    new THREE.Vector3(-1, 0, 0),
                    new THREE.Vector3(-1, 0, 1)
                ];
                var caster = new THREE.Raycaster();
                var distance = 0.2;
                for (var i = 0; i < rays.length; i += 1) {
                    caster.set(_this.ball.position, rays[i]);
                    blocks.push(_this.playerItem);
                    collisions = caster.intersectObjects(blocks);
                    if (collisions.length > 0 && collisions[0].distance <= distance) {
                        if (collisions[0].object.userData.objectType === Arkanoid._3DObjectTypes.Block ||
                            collisions[0].object.userData.objectType === Arkanoid._3DObjectTypes.Player)
                            return { success: true, collision: collisions[0] };
                    }
                }
                return { success: false, collision: undefined };
            };
            this.getCollisionDirection = function (point) {
                var ballPos = _this.ball.position;
                var ballPrevPos = _this.getBallPreviousPosition();
                var stepX = _this.currentConfig.ballStepX;
                var stepZ = _this.currentConfig.ballStepZ;
                if (stepX > 0 && stepZ > 0) {
                    if (point.x > 0) {
                    }
                }
                return null;
            };
            this.getBallPreviousPosition = function () {
                var pos = _this.ball.position;
                pos.x -= _this.currentConfig.ballStepX;
                pos.z -= _this.currentConfig.ballStepZ;
                return pos;
            };
            this.addLight = function () {
                var light = new THREE.PointLight(0xffffff);
                light.position.set(-5, 5, 5);
                _this.scene.add(light);
            };
            this.resetCamera = function () {
                _this.camera.position.z = 20 + _this.currentConfig.lineWidth * _this.currentConfig.blockSize / 2;
                _this.camera.position.y = 10 + _this.currentConfig.lineWidth;
                _this.camera.lookAt(_this.gridFloor.position);
            };
            this.buildWalls = function () {
                var areaSize = _this.currentConfig.lineWidth * _this.currentConfig.blockSize;
                _this.gridFloor = new THREE.GridHelper(_this.currentConfig.lineWidth, _this.currentConfig.blockSize);
                _this.gridFloor.setColors(_this.gridColor, _this.gridColor);
                _this.gridFloor.position.set(0, -1, 0);
                _this.gridFloor.userData.objectType = Arkanoid._3DObjectTypes.Wall;
                _this.scene.add(_this.gridFloor);
                _this.rightWall = new THREE.Object3D();
                for (var i = _this.currentConfig.lineWidth / -2 + 1; i < _this.currentConfig.lineWidth / 2; i++) {
                    var gridRightWall = new THREE.GridHelper(_this.currentConfig.blockSize, _this.currentConfig.blockSize / 4);
                    gridRightWall.setColors(_this.gridColor, _this.gridColor);
                    gridRightWall.position.set(i * _this.currentConfig.blockSize, 0, 0);
                    _this.rightWall.add(gridRightWall);
                }
                _this.rightWall.position = new THREE.Vector3(areaSize / 2, 1, 0);
                _this.rightWall.rotation.x = Math.PI / 2;
                _this.rightWall.rotation.z = Math.PI / 2;
                _this.rightWall.userData.objectType = Arkanoid._3DObjectTypes.Wall;
                _this.scene.add(_this.rightWall);
                _this.leftWall = _this.rightWall.clone();
                _this.leftWall.position.x = areaSize / -2;
                _this.leftWall.userData.objectType = Arkanoid._3DObjectTypes.Wall;
                _this.scene.add(_this.leftWall);
                _this.backWall = _this.rightWall.clone();
                _this.backWall.position = new THREE.Vector3(0, 1, -areaSize / 2);
                _this.backWall.rotation.z = 0;
                _this.backWall.userData.objectType = Arkanoid._3DObjectTypes.Wall;
                _this.scene.add(_this.backWall);
            };
            this.initBall = function () {
                var geometry = new THREE.SphereGeometry(0.2, 32, 16);
                var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
                _this.ball = new THREE.Mesh(geometry, material);
                _this.ball.position.set(0, -0.8, 0);
                _this.ball.userData.objectType = Arkanoid._3DObjectTypes.Ball;
                _this.scene.add(_this.ball);
            };
            this.initPlayer = function () {
                switch (_this.currentConfig.currentGameLevel) {
                    case Arkanoid.GameLevel.One:
                    case Arkanoid.GameLevel.Two:
                        {
                            _this.playerSize = 1;
                            break;
                        }
                    case Arkanoid.GameLevel.Three:
                    case Arkanoid.GameLevel.Four:
                        {
                            _this.playerSize = 2;
                            break;
                        }
                    case Arkanoid.GameLevel.Five:
                    case Arkanoid.GameLevel.Six:
                    case Arkanoid.GameLevel.Seven:
                        {
                            _this.playerSize = 3;
                            break;
                        }
                    default:
                        throw new Error("wtf");
                }
                var halfAreaSize = _this.currentConfig.lineWidth * _this.currentConfig.blockSize / 2;
                var geometry = new THREE.BoxGeometry(_this.playerSize, 0.5, 0.5);
                var material = new THREE.MeshLambertMaterial({ color: 0xd3d3d3, transparent: true, opacity: 0.8 });
                _this.playerItem = new THREE.Mesh(geometry, material);
                _this.playerItem.position = new THREE.Vector3(0, -0.75, halfAreaSize - 0.5);
                _this.playerItem.userData.objectType = Arkanoid._3DObjectTypes.Player;
                _this.scene.add(_this.playerItem);
            };
            this.isGameOver = function () {
                var lineCount = _this.currentConfig.currentGameLevel.valueOf();
                for (var i = 0; i < _this.currentConfig.lineWidth; i++) {
                    for (var j = 0; j < lineCount; j++) {
                        if (_this.blocks[i][j] != null || _this.blocks[i][j] != undefined) {
                            return false;
                        }
                    }
                }
                return true;
            };
            this.buildBlocks = function () {
                var lineCount = _this.currentConfig.currentGameLevel.valueOf();
                _this.blocks = Arkanoid.make2DArray(_this.currentConfig.lineWidth, lineCount);
                var halfAreaSize = _this.currentConfig.lineWidth * _this.currentConfig.blockSize / 2;
                for (var i = 0; i < _this.currentConfig.lineWidth; i++) {
                    for (var j = 0; j < lineCount; j++) {
                        var block = _this.createBlock(_this.currentConfig.blockSize);
                        block.userData.objectType = Arkanoid._3DObjectTypes.Block;
                        block.position.z = j * 2 - halfAreaSize + 1;
                        block.position.x = i * 2 - halfAreaSize + 1;
                        _this.blocks[i][j] = block;
                        _this.scene.add(block);
                    }
                }
            };
            this.breakBlock = function (block) {
                var blockVector = block.position.clone();
                _this.removeBlock(block);
                var miniBlocks = _this.getMiniBlocks(blockVector);
                var tweens = Array(miniBlocks.length);
                // mini blocks expand logic
                miniBlocks.forEach(function (obj, i, arr) {
                    var tween = new TWEEN.Tween(obj.position);
                    var rangeX = _this.getRandomIntInRange(_this.currentConfig.blockSize * 2.5);
                    var rangeY = _this.getRandomIntInRange(_this.currentConfig.blockSize * 2.5);
                    var rangeZ = _this.getRandomIntInRange(_this.currentConfig.blockSize * 2.5);
                    var destination = new THREE.Vector3(rangeX + obj.position.x, rangeY + obj.position.y, rangeZ + obj.position.z);
                    tween.onComplete(function () {
                        _this.scene.remove(obj);
                        obj = null;
                    });
                    tween.to(destination, 1200);
                    tween.easing(TWEEN.Easing.Back.In);
                    tween.onUpdate(function () {
                        obj.rotation.x += Math.random();
                        obj.rotation.y += Math.random();
                        obj.rotation.z += Math.random();
                    });
                    tweens.push(tween);
                });
                // start expand animation
                tweens.forEach(function (obj, i, arr) {
                    obj.start();
                });
                //TODO random shit
            };
            this.getMiniBlocks = function (vector) {
                var miniBlocks = Array(15);
                var miniBlock = _this.createBlock(0.2);
                for (var i = 0; i < 15; i++) {
                    var clone = miniBlock.clone();
                    clone.position = vector.clone();
                    miniBlocks.push(clone);
                    clone.userData.objectType = Arkanoid._3DObjectTypes.MiniBlock;
                    _this.scene.add(clone);
                }
                return miniBlocks;
            };
            this.removeBlock = function (block) {
                var lineCount = _this.currentConfig.currentGameLevel.valueOf();
                var lineWidth = _this.currentConfig.lineWidth;
                for (var i = 0; i < lineWidth; i++) {
                    for (var j = 0; j < lineCount; j++) {
                        if (_this.blocks[i][j] != null && _this.blocks[i][j].position.equals(block.position)) {
                            _this.scene.remove(_this.blocks[i][j]);
                            _this.blocks[i][j] = null;
                        }
                    }
                }
            };
            this.movePlayer = function (direction) {
                var areaSize = _this.currentConfig.lineWidth * _this.currentConfig.blockSize;
                var playerStep = _this.currentConfig.currentPlayerStep;
                var playerX = _this.playerItem.position.x;
                var increment = 0;
                switch (direction) {
                    case Arkanoid.Directions.Left:
                        {
                            if (playerX - _this.playerSize / 2 <= areaSize / -2) {
                                return;
                            }
                            increment = (-playerStep);
                            break;
                        }
                    case Arkanoid.Directions.Right:
                        {
                            if (playerX + _this.playerSize / 2 >= areaSize / 2) {
                                return;
                            }
                            increment = (+playerStep);
                            break;
                        }
                    default:
                }
                _this.playerItem.position.x += increment;
            };
            this.initEvents = function () {
                window.addEventListener("keydown", function (e) {
                    if (_this.currentKeyTimeoutId != null) {
                        return;
                    }
                    switch (e.keyCode) {
                        case Arkanoid.Keys.Left:
                            {
                                _this.currentKeyTimeoutId = setInterval(function () {
                                    _this.movePlayer(Arkanoid.Directions.Left);
                                }, _this.currentConfig.playerStepDelay);
                                break;
                            }
                        case Arkanoid.Keys.Up:
                            {
                                break;
                            }
                        case Arkanoid.Keys.Right:
                            {
                                _this.currentKeyTimeoutId = setInterval(function () {
                                    _this.movePlayer(Arkanoid.Directions.Right);
                                }, _this.currentConfig.playerStepDelay);
                                break;
                            }
                        case Arkanoid.Keys.Down:
                            {
                                break;
                            }
                        default: { }
                    }
                }, true);
                window.addEventListener("keyup", function (e) {
                    if (_this.currentKeyTimeoutId == null) {
                        return;
                    }
                    switch (e.keyCode) {
                        case Arkanoid.Keys.Left:
                        case Arkanoid.Keys.Right:
                            {
                                clearInterval(_this.currentKeyTimeoutId);
                                _this.currentKeyTimeoutId = null;
                                break;
                            }
                        default: { }
                    }
                }, true);
            };
            this.render = function () {
                TWEEN.update();
                _this.renderer.setSize(window.innerWidth, window.innerHeight);
                _this.camera.aspect = window.innerWidth / window.innerHeight;
                _this.camera.updateProjectionMatrix();
                _this.renderer.render(_this.scene, _this.camera);
                _this.renderId = requestAnimationFrame(_this.render);
            };
            this.createBlock = function (x, y, z) {
                if (y === void 0) { y = null; }
                if (z === void 0) { z = null; }
                if (y == null) {
                    y = z = x;
                }
                var geometry = new THREE.BoxGeometry(x, y, z);
                var material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("resources/brick.png") });
                return new THREE.Mesh(geometry, material);
            };
            this.getTexture = function (width, height, left, top, text, style, font, backColor) {
                switch (text.length) {
                    case 1:
                        left = 75;
                        break;
                    case 2:
                        left = 55;
                        break;
                    case 3:
                        left = 30;
                        break;
                }
                var canvas = _this.getCanvas(width, height);
                var g = canvas.getContext("2d");
                g.font = font;
                g.fillStyle = backColor;
                g.fillRect(0, 0, width, height);
                g.fillStyle = style;
                g.fillText(text, left, top);
                var texture = new THREE.Texture(canvas);
                texture.needsUpdate = true;
                return texture;
            };
            this.getCanvas = function (width, height) {
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                return canvas;
            };
            this.getRandomColorHex = function () {
                var random = Math.random().toPrecision(12);
                var str = "0x" + random.substr(3, 6);
                return parseInt(str, 16);
            };
            this.getRandomIntInRange = function (n) {
                n = Math.floor(n);
                var number = Math.floor(Math.random() * 10 * n) % n;
                if (Math.floor(Math.random() * 100) % 2 === 0) {
                    return number;
                }
                else {
                    return -number;
                }
            };
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            domElement.appendChild(this.renderer.domElement);
            this.orbitControler = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.initEvents();
        }
        return ArkanoidGame;
    })();
    Arkanoid.ArkanoidGame = ArkanoidGame;
})(Arkanoid || (Arkanoid = {}));
/// <reference path="Arkanoid.ts"/>
var ark = Arkanoid.ArkanoidGame;
var Config = Arkanoid.Config;
var domElement = document.getElementById("game");
var game = new ark(domElement);
//var config = new Config(Arkanoid.GameLevel.Three, 2, 0.2, 0.2, 10);
var func = function () {
    var config = Arkanoid.Config.getDefaultConfig();
    try {
        var level = parseInt(prompt("enter new game level ( 1-7 ) : ", ""), 10);
        var gamelevel = level;
        if (isNaN(gamelevel))
            throw Error("");
        config.currentGameLevel = gamelevel;
    }
    catch (e) {
        config.currentGameLevel = Arkanoid.GameLevel.Three;
    }
    game.newGame(config);
};
Arkanoid.ArkanoidGame.onEnd = func;
func();
//# sourceMappingURL=main.js.map