import Container = PIXI.Container;
import { Graphics, Loader, Sprite } from "pixi.js";

export default class MainContainer extends Container {
	public static readonly WIDTH:number = 1000;
	public static readonly HEIGHT:number = 600;
	private _background:Sprite;

	constructor() {
		super();
		this.pictureLoader();
	}

	private pictureLoader():void {
        const loader:Loader = new Loader();
		loader.add("background", "nightCityBackground.png");
		loader.on("complete", ()=> {
			this.initialBackground();
		});
		loader.load();
	}

	private initialBackground():void {
		this._background = Sprite.from("background");
		this.addChild(this._background);
	}
}