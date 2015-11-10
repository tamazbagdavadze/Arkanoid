module Arkanoid {

    export function make2DArray<T>(width: number, height: number = null): T[][] {

        height = height == null ? width : height;

        var arr = Array<Array<T>>(width);

        for (let i = 0; i < width; i++) {
            arr[i] = Array<T>(height);
        }

        return arr;
    }

    export function make3DArray<T>(n: number): T[][][] {
        var arr = Array<Array<Array<T>>>(n);

        for (let i = 0; i < n; i++) {
            arr[i] = Array<Array<T>>(n);

            for (let j = 0; j < n; j++) {
                arr[i][j] = Array<T>(n);
            }
        }

        return arr;
    }

    export function convert2DTo1DArray<T>(arr: T[][]): T[] {

        var resultArr = Array<T>(0);

        for (var i = 0; i < arr.length; i++) {
            let length = arr[i].length;

            for (var j = 0; j < length; j++) {
                resultArr.push(arr[i][j]);
            }
        }

        return resultArr;
    }

    export function newDiv(id: string = "", className: string = "", size: number = undefined): HTMLDivElement {

        var div = document.createElement("div");
        div.id = id;
        div.className = className;

        if (size !== undefined && size !== null && isNaN(size) === false) {
            div.setAttribute("style", `width:${size}px; height:${size}px;`);
        }

        return div;
    }

    export class Point2D {
        constructor(public x: number = 0, public y: number = 0) {

        }
    }

    export class Point3D {
        constructor(public x: number = 0, public y: number = 0, public z: number = 0) {

        }
    }
}