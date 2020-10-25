import { Graphics } from "pixi.js";

export default class Shot extends Graphics {
    private _shotSize:number = 5;

	constructor() {
        super();

        this.beginFill(0xffff00, 1)
        .lineStyle(1, 0x000000, .5, 0)
        .drawRect(0, 0, this._shotSize, this._shotSize);
    }
}