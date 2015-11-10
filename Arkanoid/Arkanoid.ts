/// <reference path="GameLevel.ts"/>
/// <reference path="Helpers.ts"/>
/// <reference path="KeyCodeEnum.ts"/>
/// <reference path="Directions.ts"/>

"use strict";

module Arkanoid {
    export class ArkanoidGame {

        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera; // THREE.Camera; 
        renderer: THREE.WebGLRenderer;

        orbitControler: THREE.OrbitControls;

        level  = GameLevel.Three;
        blockSize = 2;
        //blockColor = 0x00FFFF;
        array : THREE.Mesh[][];
   
        playerItem: THREE.Mesh;
        playerStep = 0.2;
        playerSize: number;

        ball: THREE.Mesh;
        ballStepSize: number;

        lineWidth = 10;


        init() {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById("game").appendChild(this.renderer.domElement);
            
            this.orbitControler = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            
            this.initBlocks();
            this.initPlayer();
            this.initBall();
            
            var light = new THREE.PointLight(0xffffff);
            light.position.set(-5, 5, 5);
            this.scene.add(light);
            
            var gridFloor = new THREE.GridHelper(this.lineWidth, this.blockSize);
            gridFloor.setColors(0x006600, 0x006600);
            gridFloor.position.set(0, -1, 0);
            this.scene.add(gridFloor);
            
            this.camera.position.z = 25;
            this.camera.position.y = 20;
            this.camera.lookAt(gridFloor.position);
            
            this.render();
            this.initEvents();


            //this.startBallMoving();
        }


        private startBallMoving =() => {
            setInterval(this.ballMove, 100);
        }

        private ballMove = () => {
            this.ball.position.x += this.ballStepSize;
            this.ball.position.y += this.ballStepSize;

            
        }

        private initBall = () => {
            
            var geometry = new THREE.SphereGeometry(0.5, 32, 16);
            var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
            this.ball = new THREE.Mesh(geometry, material);
            this.ball.position.set(0, -0.5, 0);
            this.scene.add(this.ball);
        }

        private initPlayer = () => {
            
            switch (this.level) {
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
            var lineCount = this.level.valueOf();
            
            this.array = make2DArray<THREE.Mesh>(this.lineWidth, lineCount);
            
            
            for (let i = 0; i < lineCount; i++) {

                for (let j = 0; j < this.lineWidth; j++) {

                    let block = this.createBlock(this.blockSize);

                    block.position.z = i * 2 - 9;
                    block.position.x = j * 2 - 9;
                    this.array[i][j] = block;

                    this.scene.add(block);
                }
            }
        }

        private movePlayer = (direction: Directions) => {
            
            
            switch (direction) {
            case Directions.Left:
            {
                if (this.playerItem.position.x - this.playerSize + 1 <= this.lineWidth * this.blockSize / -2) {
                    return;
                }
                this.playerItem.position.x -= this.playerStep;
                break;
            }
            case Directions.Right:
            {
                if (this.playerItem.position.x + this.playerSize - 1 >= this.lineWidth * this.blockSize / 2) {
                    return;
                }
                this.playerItem.position.x += this.playerStep;
                break;
            }

            default:
            }
        }

        private initEvents = (): void => {

            window.addEventListener("resize",  (e) :void => {

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
            }, true);

            window.addEventListener("keydown", (e) => {

                switch (e.keyCode) {
                case Keys.Left:
                {
                    this.movePlayer(Directions.Left);
                    break;
                }
                case Keys.Up:
                {
                    break;
                }
                case Keys.Right:
                {
                    this.movePlayer(Directions.Right);
                    break;
                }
                case Keys.Down:
                {
                    break;
                }

                default:
                   // throw new Error("unknown keycode");
                }

            }, true);


            
        }

        private render = () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            
            this.camera.updateProjectionMatrix();

            requestAnimationFrame(this.render);
            this.renderer.render(this.scene, this.camera);
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

    }
    
}