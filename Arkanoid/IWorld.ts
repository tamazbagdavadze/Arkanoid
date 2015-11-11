module Arkanoid {
    interface IWorld {
        build(): THREE.Mesh[];
        buildWalls(): void;
        buildBlocks(): void;
    }
}