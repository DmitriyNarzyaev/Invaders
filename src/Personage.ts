import { Graphics } from "pixi.js";

export default class Personage extends Graphics {
    private _partSize:number = 5;

	constructor(json:ILevel, pesonageType:string, color:number) {
        super();

        for (let iterator:number = 0; iterator < json.blocks.length; iterator++){
            if (json.blocks[iterator].type == pesonageType) {
                this.beginFill(color, 1)
                .lineStyle(1, 0x000000, .5, 0)
                .drawRect(
                    json.blocks[iterator].x * this._partSize,			//x
                    json.blocks[iterator].y * this._partSize,			//y
                    json.blocks[iterator].width * this._partSize,		//width
                    json.blocks[iterator].height * this._partSize		//height
                )
                .endFill;
            }
        }
    }
}