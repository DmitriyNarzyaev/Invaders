import Container = PIXI.Container;
import { Loader, Sprite } from "pixi.js";
import Personage from "./Personage";
import Button from "./Button";

export default class MainContainer extends Container {
	public static readonly WIDTH:number = 1000;
	public static readonly HEIGHT:number = 600;
	public static INVADERS_ARRAY:Set<Personage> = new Set();
	public static INVADERS_CONTAINER:Container;
	public static PLAYER_1:Personage;
	private _background:Sprite;
	private _invader:Personage;
	private _json:ILevel;
	private _jsonIsLoaded:Boolean;
	private _backgroundIsLoaded:Boolean;
	private _button:Button;

	constructor() {
		super();
		this.pictureLoader();
		this.jsonLoader();
	}

	private pictureLoader():void {
        const loader:Loader = new Loader();
		loader.add("background", "nightCityBackground.png");
		loader.add("title", "title.png");
		loader.on("complete", ()=> {
			this._backgroundIsLoaded = true;
			this.checkLoadingsAndTryToStart();
		});
		loader.load();
	}

	private jsonLoader():void {
		const xhr:XMLHttpRequest = new XMLHttpRequest();
		xhr.responseType = "json";
		xhr.open("GET", "personages.json", true);
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					this._json = xhr.response;
					this._jsonIsLoaded = true;
					this.checkLoadingsAndTryToStart();
				} else {
					console.log("JSON ERROR");
				}
			}
		};
		xhr.send();
	}

	private checkLoadingsAndTryToStart():void {
		if (this._backgroundIsLoaded && this._jsonIsLoaded) {
			this.initialStartTitle();
		}
	}

	private initialStartTitle():void {
		this.initialBackground("title");
		this.initialButton("START");
	}

	private initialBackground(pictureName:string):void {
		this._background = Sprite.from(pictureName);
		this.addChild(this._background);
	}

	private removeBackground():void {
		this.removeChild(this._background);
		this.removeChild(this._button);
	}

	private initialButton(buttonName:string):void {
		this._button = new Button(buttonName, () => {this.initialGame();});
		this.addChild(this._button);
		this._button.x = (MainContainer.WIDTH - this._button.width)/2;
		this._button.y = MainContainer.HEIGHT - this._button.height*2;
	}

	private initialGame():void {
		this.removeBackground();
		this.initialBackground("background");
		this.initialInvaders();
		this.initialPlayer();
	}

	private initialInvaders():void {
		const invaderGap:number = 5;
		const numberInvaders:number = 24;
		let invaderX:number = 0;
		let invaderY:number = 0;
		let invadersLine:number = 8;
		MainContainer.INVADERS_CONTAINER = new Container;
		this.addChild(MainContainer.INVADERS_CONTAINER);
		for (let iterator:number = 0; iterator < numberInvaders; iterator++){
			this._invader = new Personage(this._json, "invader", 0x00ffff);
			MainContainer.INVADERS_CONTAINER.addChild(this._invader);
			MainContainer.INVADERS_ARRAY.add(this._invader);
			this._invader.x = invaderX;
			this._invader.y = invaderY;
			invaderX += this._invader.width + invaderGap;
			if ((iterator + 1) % invadersLine == 0) {
				invaderX = 0;
				invaderY += this._invader.height + invaderGap;
			}
		}
		MainContainer.INVADERS_CONTAINER.x =
			(MainContainer.WIDTH/2) -
			((this._invader.width*8) +
			(invaderGap*7))/2;
	}

	private initialPlayer():void {
		MainContainer.PLAYER_1 = new Personage(this._json, "player", 0xffff00);
		this.addChild(MainContainer.PLAYER_1);
		MainContainer.PLAYER_1.x = (MainContainer.WIDTH/2) - (MainContainer.PLAYER_1.width/2);													//fixme
		MainContainer.PLAYER_1.y = MainContainer.HEIGHT - MainContainer.PLAYER_1.height-1;
	}
}