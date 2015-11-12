module Arkanoid {
    export class Config {

        private static defualtConfig = new Config(GameLevel.Two, 2, 0.2, 0.2, 0.2, 10, 0.5);

        currentGameLevel: GameLevel;
        blockSize :number;
        currentPlayerStep: number;
        ballStepX :number; // still not used
        ballStepZ :number; // still not used
        lineWidth: number;
        playerStepDelay:number;

        constructor(currentGameLevel: GameLevel, blockSize: number,
            currentPlayerStep: number, ballStepX: number, ballStepZ: number,
            lineWidth: number, playerStepDelay: number) {

            this.blockSize = blockSize;
            this.ballStepX = ballStepX;
            this.ballStepZ = ballStepZ;
            this.currentGameLevel = currentGameLevel;
            this.currentPlayerStep = currentPlayerStep;
            this.lineWidth = lineWidth;
            this.playerStepDelay = playerStepDelay;
        }

        static getDefaultConfig = ():Config => {
            return Config.clone(Config.defualtConfig);
        }

        static clone = (obj:Config):Config => {
            return new Config(obj.currentGameLevel, obj.blockSize,
                obj.currentPlayerStep, obj.ballStepX, obj.ballStepZ,
                obj.lineWidth, obj.playerStepDelay);
        }
    }
}