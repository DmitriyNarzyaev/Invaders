import Container = PIXI.Container;
import { Loader, Sprite } from "pixi.js";
import Personage from "./Personage";
import Button from "./Button";
import Controller from "./Controller";
import Global from "./Global";
import Shot from "./Shot";
import HitTest from "./HitTest";

export default class MainContainer extends Container {
	public static readonly WIDTH:number = 1000;
	public static readonly HEIGHT:number = 600;
	public static INVADERS_ARRAY:Set<Personage> = new Set();
	public static INVADERS_CONTAINER:Container;
	public static PLAYER_1:Personage;
	private _background:Sprite;
	private _descriptionPic:Sprite;
	private _invader:Personage;
	private _json:ILevel;
	private _jsonIsLoaded:Boolean;
	private _backgroundIsLoaded:Boolean;
	private _button:Button;
	private _controller:Controller;
	private _iterator:number = 0;
	private _shotArray:Set<Shot> = new Set();
	private _border:number = 10;
	public static SHOT_SWITCHER:boolean = false;
    private _shotSpeed:number = 5;
    private _invaderOrientation:number = 10;
    private _invadersContainerWidth:number;

	constructor() {
		super();
		this.pictureLoader();
		this.jsonLoader();
	}

	private pictureLoader():void {
        const loader:Loader = new Loader();
		loader.add("background", "nightCityBackground.png");
		loader.add("title", "title.png");
		loader.add("startPic", "start_to_title.png");
		loader.add("winPic", "win_to_title.png");
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
		this.initialBackground("title", "startPic");
		this.initialButton("START");
	}

	private initialWinTitle():void {
		this.initialBackground("title", "winPic");
		this.initialButton("RESTART");
	}

	private initialBackground(pictureName:string, descriptionPicName:string):void {
		this._background = Sprite.from(pictureName);
		this.addChild(this._background);

		if (descriptionPicName != "") {
			this._descriptionPic = Sprite.from(descriptionPicName);
			this.addChild(this._descriptionPic);
			this._descriptionPic.x = (this._background.width - this._descriptionPic.width)/2;
			this._descriptionPic.y = this._background.height - this._descriptionPic.height*1.4;
		}
	}

	private removeBackground():void {
		this.removeChild(this._background);
		this.removeChild(this._descriptionPic);
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
		this.initialBackground("background", "");
		this.initialInvaders();
		this.initialPlayer();
		this.initialButtonListeners();

		this._invadersContainerWidth = MainContainer.INVADERS_CONTAINER.width;
		Global.PIXI_APP.ticker.add(this.ticker, this);
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

	private initialShot():void {
		let shot:Shot = new Shot;
			this.addChild(shot);
			this._shotArray.add(shot);
			shot.x = MainContainer.PLAYER_1.x + (MainContainer.PLAYER_1.width - shot.width)/2 ;
            shot.y = MainContainer.PLAYER_1.y - shot.height;
	}

	private initialButtonListeners():void {
		this._controller = new Controller;
		this.addChild(this._controller);
	}

	private ticker():void {
        this._iterator += 1;

        //******BUTTON_RIGHT
		if ((MainContainer.PLAYER_1.x + MainContainer.PLAYER_1.width <= MainContainer.WIDTH - this._border)
		&& (Controller.BUTTON_RIGHT == true)) {
            MainContainer.PLAYER_1.x += 2;
        }

        //******BUTTON_LEFT
		if (MainContainer.PLAYER_1.x >= this._border && Controller.BUTTON_LEFT == true) {
            MainContainer.PLAYER_1.x -= 2;
        }
        
        //******BUTTON_UP
		if (Controller.BUTTON_UP == true && MainContainer.SHOT_SWITCHER == true) {
			this.initialShot();
			MainContainer.SHOT_SWITCHER = false;
        }
        
        this._shotArray.forEach((shot:Shot)=> {
			shot.y -= this._shotSpeed;
			MainContainer.INVADERS_ARRAY.forEach((invader)=> {
                if (
                    HitTest.horizontal(invader, shot, MainContainer.INVADERS_CONTAINER) &&
                    HitTest.vertical(invader, shot, MainContainer.INVADERS_CONTAINER)
                ){
                    this.removeChild(shot);
                    MainContainer.INVADERS_CONTAINER.removeChild(invader);
                    this._shotArray.delete(shot);
                    MainContainer.INVADERS_ARRAY.delete(invader);
                    if (MainContainer.INVADERS_ARRAY.size <= 0) {
                        console.log("********************************");
						this.initialWinTitle();
						Global.PIXI_APP.ticker.remove(this.ticker, this);
						this._shotArray.clear();
                    }
                }
            });
			if (shot.y + shot.height <= 0) {
				this.removeChild(shot);
                this._shotArray.delete(shot);
			}
        });
        
        if (this._iterator >= 50){
            //смена направления движения мобов у стен
            if (MainContainer.INVADERS_CONTAINER.x +
                this._invadersContainerWidth >= MainContainer.WIDTH - 20) {
                this._invaderOrientation = -10;
            } else if (MainContainer.INVADERS_CONTAINER.x <= 20) {
                this._invaderOrientation = 10;
            }
            MainContainer.INVADERS_CONTAINER.x += this._invaderOrientation;
            this._iterator = 0;
        }
    }
}