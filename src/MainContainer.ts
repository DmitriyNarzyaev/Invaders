import Container = PIXI.Container;
import { Graphics } from "pixi.js";

export default class MainContainer extends Container {
	public static readonly WIDTH:number = 1000;
	public static readonly HEIGHT:number = 600;

	constructor() {
		super();

		let background: Graphics = new Graphics;
		background.beginFill(0x00ff48);
		background.drawRect(0, 0, MainContainer.WIDTH, MainContainer.HEIGHT);
		this.addChild(background);
	}
}