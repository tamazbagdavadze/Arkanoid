﻿/// <reference path="GameLevel.ts"/>
/// <reference path="Helpers.ts"/>
/// <reference path="KeyCodeEnum.ts"/>
/// <reference path="Directions.ts"/>
/// <reference path="Config.ts"/>

"use strict";

module Arkanoid {
    export class ArkanoidGame {

        private currentConfig:Config;

        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera; // THREE.Camera; 
        renderer: THREE.WebGLRenderer;

        orbitControler: THREE.OrbitControls;
        
        array : THREE.Mesh[][];
   
        playerItem: THREE.Mesh;
        playerSize: number;
        

        ball: THREE.Mesh;
        
        //ballStepSize: number;
        //lineWidth = 10;
        //level  = GameLevel.Three;
        //blockSize = 2;
        //playerStep = 0.2;

        //blockColor = 0x00FFFF;

        gridColor = 0x006600;

        gridFloor: THREE.GridHelper;

        rightWall: THREE.Object3D;
        leftWall: THREE.Object3D;
        backWall: THREE.Object3D;

        currentBallTween: TWEEN.Tween;
        
        currentKeyTimeoutId:number = null;

        get config(): Config {
             return Config.clone(this.currentConfig);
        }

//        set config(config: Config) {
//            this.currentConfig = config;
//        }

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

            this.initBlocks();
            this.initPlayer();
            this.initBall();
            this.buildWalls();

            this.addLight();
            
            this.resetCamera();

            this.render();
            this.initEvents();
            
//            this.start();
        }
        
        private start =() => {
            this.currentBallTween = new TWEEN.Tween(this.ball.position);
            this.currentBallTween.to({ 'x': this.getRandomNumInRange(this.currentConfig.lineWidth / 2), 'z': -this.currentConfig.lineWidth }, 5000);
            this.currentBallTween.onComplete(() => {
                alert("fsfsdf");
            });

            this.currentBallTween.easing(TWEEN.Easing.Linear.None);
            this.currentBallTween.start();
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
            this.scene.add(this.gridFloor);

            this.rightWall = new THREE.Object3D();

            for (let i = this.currentConfig.lineWidth / -2 + 1; i < this.currentConfig.lineWidth/2; i++) {
                let gridRightWall = new THREE.GridHelper(this.currentConfig.blockSize, this.currentConfig.blockSize / 4);
                gridRightWall.setColors(this.gridColor, this.gridColor);
                gridRightWall.position.set(i * this.currentConfig.blockSize, 0, 0);
                this.rightWall.add(gridRightWall);
            }

            this.rightWall.position = new THREE.Vector3(-areaSize / 2, 1, 0);
            this.rightWall.rotation.x = Math.PI / 2;
            this.rightWall.rotation.z = Math.PI / 2;
            this.scene.add(this.rightWall);

            this.leftWall = this.rightWall.clone();
            this.leftWall.position.x = areaSize / 2;
            this.scene.add(this.leftWall);

            this.backWall = this.rightWall.clone();
            this.backWall.position = new THREE.Vector3(0, 1, -areaSize / 2);
            this.backWall.rotation.z = 0;
            this.scene.add(this.backWall);

        }
        
        private initBall = () => {
            
            var geometry = new THREE.SphereGeometry(0.5, 32, 16);
            var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
            this.ball = new THREE.Mesh(geometry, material);
            this.ball.position.set(0, -0.5, 0);
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

            this.scene.add(this.playerItem);
        }

        private initBlocks = () => {
            var lineCount = this.currentConfig.currentGameLevel.valueOf();
            
            this.array = make2DArray<THREE.Mesh>(this.currentConfig.lineWidth, lineCount);
            
            for (let i = 0; i < this.currentConfig.lineWidth; i++) {

                for (let j = 0; j < lineCount; j++) {

                    let block = this.createBlock(this.currentConfig.blockSize);

                    block.position.z = j * 2 - 9;
                    block.position.x = i * 2 - 9;
                    this.array[i][j] = block;

                    this.scene.add(block);
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

            this.collision();

            TWEEN.update();

            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            
            this.camera.updateProjectionMatrix();

            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(this.render);
        }
        
        private collision = () => {

            var ball = this.ball;

            var originPoint = ball.position.clone();
            
            for (let vertexIndex = 0; vertexIndex < ball.geometry.vertices.length; vertexIndex++) {

                let localVertex = ball.geometry.vertices[vertexIndex].clone();
                let globalVertex = localVertex.applyMatrix4(ball.matrixWorld);
                let directionVector = globalVertex.sub(ball.position);
                
                let ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());

                let objs = convert2DTo1DArray<THREE.Mesh>(this.array);
                
                let collisionResults = ray.intersectObjects(objs);
                if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                    console.log("collision blocks " + collisionResults.length + " " + collisionResults[0].distance);
                }

                objs = [this.playerItem];

                collisionResults = ray.intersectObjects(objs);
                if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                    console.log("collision playerItem " + collisionResults.length + " " + collisionResults[0].distance);
                }



//                objs = [this.rightWall];
//
//                collisionResults = ray.intersectObjects(objs);
//                if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
//                    console.log("collision rightwall" + collisionResults.length + " " + collisionResults[0].distance);
//                }
//
//                objs = [this.leftWall];
//
//                collisionResults = ray.intersectObjects(objs);
//                if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
//                    console.log("collision leftWall" + collisionResults.length + " " + collisionResults[0].distance);
//                }
//
//                objs = [this.backWall];
//
//                collisionResults = ray.intersectObjects(objs);
//                if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
//                    console.log("collision backWall" + collisionResults.length + " " + collisionResults[0].distance);
//                }
            }	
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

        private getRandomNumInRange = (n: number): number => {

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