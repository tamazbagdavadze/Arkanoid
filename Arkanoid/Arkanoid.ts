
module Arkanoid {
    export class A {

        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera; // THREE.Camera; 
        renderer: THREE.WebGLRenderer;

        orbitControler: THREE.OrbitControls;

        blockSize = 1;
        blockColor = 0x00FFFF;

        init() {
             this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById("game").appendChild(this.renderer.domElement);



            this.orbitControler = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            
            var block = this.createBlock(this.blockSize, this.blockSize, this.blockSize, this.blockColor);
            
            var temp = new THREE.BoxHelper(block);
            
            temp.material.color.set(0x000000);
            
            
            this.scene.add(temp);
            this.scene.add(block);

            this.camera.position.z = 5;
            
            this.render();

            this.initEvents();
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
            },true);
            
        }

        private render = () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;

            this.camera.updateProjectionMatrix();

            requestAnimationFrame(this.render);
            this.renderer.render(this.scene, this.camera);
        }

        private getBlock = ():THREE.Mesh => {
            var geometry = new THREE.BoxGeometry(this.blockSize, this.blockSize, this.blockSize);
            var material = new THREE.MeshBasicMaterial({ color: this.getRandomColorHex() });
            var cube = new THREE.Mesh(geometry, material);
            return cube;
        }

        private createBlock = (x:number,y:number,z:number, color:number):THREE.Mesh => {
            return new THREE.Mesh(
                new THREE.BoxGeometry(x, y, z),
                new THREE.MeshBasicMaterial({ color: this.getRandomColorHex() })
            );
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