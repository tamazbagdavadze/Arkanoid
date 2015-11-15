/// <reference path="GameLevel.ts"/>
/// <reference path="Helpers.ts"/>
/// <reference path="KeyCodeEnum.ts"/>
/// <reference path="Directions.ts"/>
/// <reference path="Config.ts"/>
/// <reference path="3DObjectTypes.ts"/>

"use strict";

module Arkanoid {
    export class ArkanoidGame {

        private currentConfig:Config;

        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera; // THREE.Camera; 
        renderer: THREE.WebGLRenderer;

        orbitControler: THREE.OrbitControls;
        
        blocks : THREE.Mesh[][];
   
        playerItem: THREE.Mesh;
        playerSize: number;
        
        ball: THREE.Mesh;
        
        ballPrevPos: THREE.Vector3;

        ballDelay = 1;
        
        gridColor = 0x006600;

        gridFloor: THREE.GridHelper;

        rightWall: THREE.Object3D;
        leftWall: THREE.Object3D;
        backWall: THREE.Object3D;
        
        currentKeyTimeoutId: number = null;

        currentBallIntervalId: number = null;
        
        constructor(domElementId:string) {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById(domElementId).appendChild(this.renderer.domElement);
            this.orbitControler = new THREE.OrbitControls(this.camera, this.renderer.domElement);            
        }

        newGame = (config:Config = Config.getDefaultConfig())=> {

            this.currentConfig = config;

            this.buildBlocks();
            this.initPlayer();
            this.initBall();
            this.buildWalls();

            this.addLight();
            
            this.resetCamera();

            this.render();
            this.initEvents();

            this.ballPrevPos = this.ball.position.clone();
            
            this.currentConfig.ballStepX = this.randomStartStep();
            this.currentConfig.ballStepZ = this.randomStartStep()+0.01;
            
            this.start();

        }
        
        private randomStartStep = ()=> {
            var n = Math.random();
            n = Math.floor(n * 10000);
            n = n % 0.08;
            if (Math.random() > 0.4) {
                n = -n;
            }
            return n;
        }

        private start = () => {

            this.currentBallIntervalId = setInterval(() => {
                this.ball.position.x += this.currentConfig.ballStepX;
                
                this.ball.position.z += this.currentConfig.ballStepZ;
                
                this.onBallMove();

            },0);

        }
        
        private onBallMove = () => {

            var collisionToBlockResult = this.collisionToBlock();

            var ball = this.ball;
            var ballPos = ball.position;
            
            var ballPrevPos = this.ballPrevPos.clone();
            this.ballPrevPos = ball.position.clone();

            var halfAreaSize = this.currentConfig.lineWidth * this.currentConfig.blockSize / 2;
            

            if (collisionToBlockResult.success && collisionToBlockResult.collision.object.userData.objectType === _3DObjectTypes.Player) {
                   clearInterval(this.currentBallIntervalId);

                   this.currentConfig.ballStepZ = -this.currentConfig.ballStepZ;
                   this.start();
            }
            else
                
            if (collisionToBlockResult.success) {
                
                var block = collisionToBlockResult.collision.object;
                var touchPoint = collisionToBlockResult.collision.point;
                this.breakBlock(block);

                if (ballPrevPos.x >= ballPos.x) {
                    if (ballPrevPos.z >= ballPos.z) { // x--, z-- 

                        if (touchPoint.x < ballPos.x) { // left up (left)
                            clearInterval(this.currentBallIntervalId);

                            this.currentConfig.ballStepX = -this.currentConfig.ballStepX;
                            this.start();

                        } else { // left up (up)                 
                            clearInterval(this.currentBallIntervalId);

                            this.currentConfig.ballStepZ = -this.currentConfig.ballStepZ;
                            this.start();
                        }
                    } else { // x--, z++

                        if (touchPoint.z > ballPos.z) { // left down (down)
                            clearInterval(this.currentBallIntervalId);

                            this.currentConfig.ballStepZ = -this.currentConfig.ballStepZ;
                            this.start();

                        } else {
                            clearInterval(this.currentBallIntervalId);

                            this.currentConfig.ballStepX = -this.currentConfig.ballStepX;
                            this.start();
                        }
                    }
                } else {
                    if (ballPrevPos.z >= ballPos.z) { // x++, z--

                        if (touchPoint.x > ballPos.x) { // right up ( right )
                            clearInterval(this.currentBallIntervalId);

                            this.currentConfig.ballStepX = -this.currentConfig.ballStepX;
                            this.start();

                        } else { // right up (up)
                            clearInterval(this.currentBallIntervalId);

                            this.currentConfig.ballStepZ = -this.currentConfig.ballStepZ;
                            this.start();
                        }
                    } else { // x++, z++

                        if (touchPoint.z > ballPos.z) { // right down (down)
                            clearInterval(this.currentBallIntervalId);

                            this.currentConfig.ballStepZ = -this.currentConfig.ballStepZ;
                            this.start();

                        } else {
                            clearInterval(this.currentBallIntervalId);

                            this.currentConfig.ballStepX = -this.currentConfig.ballStepX;
                            this.start();
                        }
                    }
                }
            } else {                               // outside
                if (ballPos.x <= -halfAreaSize) {
                    if (ballPrevPos.z > ballPos.z) { // up
                        clearInterval(this.currentBallIntervalId);

                        this.currentConfig.ballStepX = -this.currentConfig.ballStepX;
                        this.start();

                    } else {
                        clearInterval(this.currentBallIntervalId);

                        this.currentConfig.ballStepX = -this.currentConfig.ballStepX;
                        this.start();
                    }
                }
                else if (ballPos.x > halfAreaSize) {
                    if (ballPrevPos.z > ballPos.z) { // up
                        clearInterval(this.currentBallIntervalId);

                        this.currentConfig.ballStepX = -this.currentConfig.ballStepX;
                        this.start();
                    } else {
                        clearInterval(this.currentBallIntervalId);

                        this.currentConfig.ballStepX = -this.currentConfig.ballStepX;
                        this.start();
                    }
                }

                else if (ballPos.z <= -halfAreaSize) { // up
                    if (ballPrevPos.x > ballPos.x) { // left
                        clearInterval(this.currentBallIntervalId);

                        this.currentConfig.ballStepZ = -this.currentConfig.ballStepZ;
                        this.start();
                    } else {
                        clearInterval(this.currentBallIntervalId);

                        this.currentConfig.ballStepZ = -this.currentConfig.ballStepZ;
                        this.start();
                    }
                } else if (ballPos.z > halfAreaSize - 0.4) {

                    clearInterval(this.currentBallIntervalId);

                    alert("game over");
//                    if (ballPrevPos.x > ballPos.x) { // left
//                        clearInterval(this.currentBallIntervalId);
//
//                        this.currentConfig.ballStepZ = -this.currentConfig.ballStepZ;
//                        this.start();
//                    } else {
//                        clearInterval(this.currentBallIntervalId);
//
//                        this.currentConfig.ballStepZ = -this.currentConfig.ballStepZ;
//                        this.start();
//                    }
                }
            }
        }

        private collisionToBlock = () => {
            
            var collisions: THREE.Intersection[];
            var blocks = convert2DTo1DArray(this.blocks) as THREE.Object3D[];
            
            var  rays = [
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

            for (let i = 0; i < rays.length; i += 1) {
                caster.set(this.ball.position, rays[i]);
                blocks.push(this.playerItem);
                collisions = caster.intersectObjects(blocks);
                
                if (collisions.length > 0 && collisions[0].distance <= distance) {
                    
                    if (collisions[0].object.userData.objectType === _3DObjectTypes.Block || 
                        collisions[0].object.userData.objectType === _3DObjectTypes.Player)
                        return {success:true, collision: collisions[0]};
                }
            }

            return { success: false, collision: undefined};
        }

        private getCollisionDirection = (point:THREE.Vector3):Directions => {

            var ballPos = this.ball.position;
            var ballPrevPos = this.getBallPreviousPosition();

            var stepX = this.currentConfig.ballStepX;
            var stepZ = this.currentConfig.ballStepZ;

            if (stepX > 0 && stepZ > 0) {
                if (point.x > 0) {//??????
                    
                }
            }


            return null;
        }

        private getBallPreviousPosition = ():THREE.Vector3 => {
            var pos = this.ball.position;
            pos.x -= this.currentConfig.ballStepX;
            pos.z -= this.currentConfig.ballStepZ;
            return pos;
        }

        private addLight = () => {
            var light = new THREE.PointLight(0xffffff);
            light.position.set(-5, 5, 5);
            this.scene.add(light);
        }

        private resetCamera = () => {
            this.camera.position.z = 25;
            this.camera.position.y = 20;
            this.camera.lookAt(this.gridFloor.position); 
        }

        private buildWalls = () => {
            
            var areaSize = this.currentConfig.lineWidth * this.currentConfig.blockSize;

            this.gridFloor = new THREE.GridHelper(this.currentConfig.lineWidth, this.currentConfig.blockSize);
            this.gridFloor.setColors(this.gridColor, this.gridColor);
            this.gridFloor.position.set(0, -1, 0);
            this.gridFloor.userData.objectType = _3DObjectTypes.Wall;
            this.scene.add(this.gridFloor);

            this.rightWall = new THREE.Object3D();

            for (let i = this.currentConfig.lineWidth / -2 + 1; i < this.currentConfig.lineWidth/2; i++) {
                let gridRightWall = new THREE.GridHelper(this.currentConfig.blockSize, this.currentConfig.blockSize / 4);
                gridRightWall.setColors(this.gridColor, this.gridColor);
                gridRightWall.position.set(i * this.currentConfig.blockSize, 0, 0);
                this.rightWall.add(gridRightWall);
            }

            this.rightWall.position = new THREE.Vector3(areaSize / 2, 1, 0);
            this.rightWall.rotation.x = Math.PI / 2;
            this.rightWall.rotation.z = Math.PI / 2;
            this.rightWall.userData.objectType = _3DObjectTypes.Wall;
            this.scene.add(this.rightWall);

            this.leftWall = this.rightWall.clone();
            this.leftWall.position.x = areaSize / -2;
            this.leftWall.userData.objectType = _3DObjectTypes.Wall;
            this.scene.add(this.leftWall);

            this.backWall = this.rightWall.clone();
            this.backWall.position = new THREE.Vector3(0, 1, -areaSize / 2);
            this.backWall.rotation.z = 0;
            this.backWall.userData.objectType = _3DObjectTypes.Wall;
            this.scene.add(this.backWall);

        }
      
        private initBall = () => {
            
            var geometry = new THREE.SphereGeometry(0.2, 32, 16);
            var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
            this.ball = new THREE.Mesh(geometry, material);
            this.ball.position.set(0, -0.8, 0);
            this.ball.userData.objectType = _3DObjectTypes.Ball;
            this.scene.add(this.ball);
        }

        private initPlayer = () => {
            
            switch (this.currentConfig.currentGameLevel) {
                case GameLevel.One:
                case GameLevel.Two:
                {
                    this.playerSize = 1;
                    break;
                }
                case GameLevel.Three:
                case GameLevel.Four:
                {
                    this.playerSize = 2;
                    break;
                }
                case GameLevel.Five:
                case GameLevel.Six:
                case GameLevel.Seven:
                {
                    this.playerSize = 3;
                    break;
                }
                default :
                    throw new Error("wtf");
            }

            var geometry = new THREE.BoxGeometry(this.playerSize, 0.5, 0.5);
            var material = new THREE.MeshLambertMaterial({color:0xd3d3d3, transparent:true, opacity: 0.8});
            this.playerItem = new THREE.Mesh(geometry, material);
            this.playerItem.position = new THREE.Vector3(0, -0.75, 9.75);
            this.playerItem.userData.objectType = _3DObjectTypes.Player;
            this.scene.add(this.playerItem);
        }

        private buildBlocks = () => {
            var lineCount = this.currentConfig.currentGameLevel.valueOf();
            
            this.blocks = make2DArray<THREE.Mesh>(this.currentConfig.lineWidth, lineCount);
            
            for (let i = 0; i < this.currentConfig.lineWidth; i++) {

                for (let j = 0; j < lineCount; j++) {

                    let block = this.createBlock(this.currentConfig.blockSize);
                    block.userData.objectType = _3DObjectTypes.Block;
                    block.position.z = j * 2 - 9;
                    block.position.x = i * 2 - 9;
                    this.blocks[i][j] = block;

                    this.scene.add(block);
                }
            }
            
        }

        private breakBlock = (block:THREE.Object3D) => {

            var blockVector = block.position.clone();
            this.removeBlock(block);

            var miniBlocks = this.getMiniBlocks(blockVector);
            var tweens = Array<TWEEN.Tween>(miniBlocks.length);


            // mini blocks expand logic
            miniBlocks.forEach((obj: THREE.Object3D, i, arr)=> {
                var tween = new TWEEN.Tween(obj.position);
                
                var rangeX = this.getRandomIntInRange(this.currentConfig.blockSize*2.5);
                var rangeY = this.getRandomIntInRange(this.currentConfig.blockSize*2.5);
                var rangeZ = this.getRandomIntInRange(this.currentConfig.blockSize*2.5);
              
                var destination = new THREE.Vector3(rangeX + obj.position.x,
                    rangeY + obj.position.y, rangeZ + obj.position.z);
                tween.onComplete(() => {
                    this.scene.remove(obj);
                    obj = null;
                });
                tween.to(destination, 1200);
                tween.easing(TWEEN.Easing.Back.In);
                tween.onUpdate(() => {
                    obj.rotation.x += Math.random();
                    obj.rotation.y += Math.random();
                    obj.rotation.z += Math.random();
                });
                tweens.push(tween);
            });

            // start expand animation
            tweens.forEach((obj, i, arr) => {
                obj.start();
            });
            

            //TODO random shit
        }

        private getMiniBlocks = (vector:THREE.Vector3):THREE.Mesh[] => {

            var miniBlocks = Array<THREE.Mesh>(15);
            var miniBlock = this.createBlock(0.2);

            for (let i = 0; i < 15; i++) {
                let clone = miniBlock.clone();
                clone.position = vector.clone();
                miniBlocks.push(clone);
                clone.userData.objectType = _3DObjectTypes.MiniBlock;
                this.scene.add(clone);
            }

            return miniBlocks;
        }

        private removeBlock = (block: THREE.Object3D) => {
            
            var lineCount = this.currentConfig.currentGameLevel.valueOf();
            var lineWidth = this.currentConfig.lineWidth;

            for (let i = 0; i < lineWidth; i++) {
                for (let j = 0; j < lineCount; j++) {
                    if (this.blocks[i][j] != null && this.blocks[i][j].position.equals(block.position)) {
                        this.scene.remove(this.blocks[i][j]);
                        this.blocks[i][j] = null;
                    }
                }
            } 
        }

        private movePlayer = (direction: Directions) => {

            var areaSize = this.currentConfig.lineWidth * this.currentConfig.blockSize;
            var playerStep = this.currentConfig.currentPlayerStep;
            var playerX = this.playerItem.position.x;

            var increment = 0;

            switch (direction) {
            case Directions.Left:
            {
                if (playerX - this.playerSize / 2 <= areaSize / -2) {
                    return;
                }
                increment = (-playerStep);
                break;
            }
            case Directions.Right:
            {
                if (playerX + this.playerSize / 2 >= areaSize / 2) {
                    return;
                }
                increment = (+playerStep);
                break;
            }

            default:
            }

            this.playerItem.position.x += increment;
        }

        private initEvents = () => {

            window.addEventListener("resize",  (e: UIEvent) => {

//                var canvas = this.renderer.domElement;
//
//                var width = canvas.clientWidth;
//                var height = canvas.clientHeight;
//                if (canvas.width != width || canvas.height != height) {
//                    canvas.width = width;
//                    canvas.height = height;
//                    console.log("dsdf");
//                }
//
//
//                console.log(width+ " " + height);
//                console.log(window.innerWidth + " " + window.innerHeight);
//                
            });
            
            window.addEventListener("keydown", (e:KeyboardEvent) => {

                if (this.currentKeyTimeoutId != null) {
                    return;
                }

                switch (e.keyCode) {
                    case Keys.Left:
                    {
                        this.currentKeyTimeoutId = setInterval(() => {
                            this.movePlayer(Directions.Left);
                        }, this.currentConfig.playerStepDelay);
                        
                        break;
                    }
                    case Keys.Up:
                    {
                        break;
                    }
                    case Keys.Right:
                    {
                        this.currentKeyTimeoutId = setInterval(() => {
                            this.movePlayer(Directions.Right);
                        }, this.currentConfig.playerStepDelay);
                            
                        break;
                    }
                    case Keys.Down:
                    {
                        break;
                    }

                    default:{}
                }
                
            },true);
            
            window.addEventListener("keyup", (e: KeyboardEvent) => {

                if (this.currentKeyTimeoutId == null) {
                    return;
                }

                switch (e.keyCode) {
                    case Keys.Left:
                    case Keys.Right:
                        {
                            clearInterval(this.currentKeyTimeoutId);
                            this.currentKeyTimeoutId = null;
                            
                            break;
                        }

                    default:{}
                }
            },true);

        }

        private render = () => {
            
            TWEEN.update();

            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            
            this.camera.updateProjectionMatrix();

            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(this.render);
        }
        
        private createBlock = (x: number, y: number = null, z: number = null): THREE.Mesh => {
            
            if (y == null) {
                y = z = x;
            }

            var geometry = new THREE.BoxGeometry(x, y, z);
            
            var material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("resources/brick.png")});
           
            return new THREE.Mesh(geometry,material);
        }

        private getTexture = (width:number, height:number, left:number, top:number, text:string, style:string, font:string, backColor:string)=> {
            switch (text.length) {
                case 1: left = 75;
                    break;
                case 2: left = 55;
                    break;
                case 3: left = 30;
                    break;
            }

            var canvas = this.getCanvas(width, height);
            var g = canvas.getContext("2d");

            g.font = font;

            g.fillStyle = backColor;
            g.fillRect(0, 0, width, height);

            g.fillStyle = style;
            g.fillText(text, left, top);

            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        }

        private getCanvas = (width:number, height:number) : HTMLCanvasElement => {
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            return canvas;
        }

        private getRandomColorHex = () :number => {
            var random = Math.random().toPrecision(12);
            var str = "0x" + random.substr(3, 6);
            return parseInt(str,16);
        }

        private getRandomIntInRange = (n: number): number => {

            n = Math.floor(n);

            var number = Math.floor(Math.random() * 10 * n) % n;

            if (Math.floor(Math.random() * 100) % 2 === 0) {
                return number;
            } else {
                return -number;
            }
        }

        private round = (n:number, prc:number = 0):number => {
            return +n.toFixed(prc);
        }
    }    
}