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

        gridColor = 0x006600;

        gridFloor: THREE.GridHelper;

        rightWall: THREE.Object3D;
        leftWall: THREE.Object3D;
        backWall: THREE.Object3D;

        t: TWEEN.Tween;

        
        newGame() {
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
            

            this.buildWalls();

           
            this.camera.position.z = 25;
            this.camera.position.y = 20;
            this.camera.lookAt(this.gridFloor.position);
            
            this.render();
            this.initEvents();


//            this.t = new TWEEN.Tween(this.leftWall.position);
//            this.t.to({ 'x': this.rightWall.position.x }, 1000);
//            this.t.onComplete(() => {
//                alert("fsfsdf");
//            });
//
//            this.t.easing(TWEEN.Easing.Linear.None);

            //this.t.start();


            //this.startBallMoving();
        }
        
        private buildWalls = () => {
            
            var areaSize = this.lineWidth * this.blockSize;

            this.gridFloor = new THREE.GridHelper(this.lineWidth, this.blockSize);
            this.gridFloor.setColors(this.gridColor, this.gridColor);
            this.gridFloor.position.set(0, -1, 0);
            this.scene.add(this.gridFloor);

            this.rightWall = new THREE.Object3D();

            for (let i = this.lineWidth/-2 + 1; i < this.lineWidth/2; i++) {
                let gridRightWall = new THREE.GridHelper(this.blockSize, this.blockSize / 4);
                gridRightWall.setColors(this.gridColor, this.gridColor);
                gridRightWall.position.set(i*this.blockSize, 0, 0);
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


//            this.array = new Array<Array<THREE.Mesh>>(this.lineWidth);
//
//            for (let k = 0; k < this.lineWidth; k++) {
//                this.array[k] = new Array<THREE.Mesh>(3);
//            }




            for (let i = 0; i < this.lineWidth; i++) {

                for (let j = 0; j < lineCount; j++) {

                    let block = this.createBlock(this.blockSize);

                    block.position.z = j * 2 - 9;
                    block.position.x = i * 2 - 9;
                    this.array[i][j] = block;

                    this.scene.add(block);
                }
            }

            console.log(this.array);
        }

        private movePlayer = (direction: Directions) => {

            var areaSize = this.lineWidth * this.blockSize;
            
            switch (direction) {
            case Directions.Left:
            {
                if (this.playerItem.position.x - this.playerSize + 1 <= areaSize / -2) {
                    return;
                }
                this.playerItem.position.x -= this.playerStep;
                break;
            }
            case Directions.Right:
            {
                if (this.playerItem.position.x + this.playerSize - 1 >= areaSize / 2) {
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

            this.collision();

            TWEEN.update();

            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            
            this.camera.updateProjectionMatrix();

            requestAnimationFrame(this.render);
            this.renderer.render(this.scene, this.camera);
        }
        
        private collision = () => {

            var ball = this.ball;

            var originPoint = ball.position.clone();
            
            for (let vertexIndex = 0; vertexIndex < ball.geometry.vertices.length; vertexIndex++) {

                let localVertex = ball.geometry.vertices[vertexIndex].clone();
                let globalVertex = localVertex.applyMatrix4(ball.matrix);
                let directionVector = globalVertex.sub(ball.position);
                
                let ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());

                let objs = convert2DTo1DArray<THREE.Mesh>(this.array);
                
                let collisionResults = ray.intersectObjects(objs);
                if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                    console.log("collision blocks" + collisionResults.length+" " + collisionResults[0].distance);
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

    }
    
}