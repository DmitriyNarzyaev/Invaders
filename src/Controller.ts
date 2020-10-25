import { Container } from "pixi.js";
import Global from "./Global";
import MainContainer from "./MainContainer";
import Shot from "./Shot";

export default class Controller extends Container {
    private BUTTON_LEFT:boolean = false;
    private BUTTON_RIGHT:boolean = false;
    private BUTTON_UP:boolean = false;
    private _border:number = 10;
    private _shotArray:Set<Shot> = new Set();
	private _shotSwitcher:boolean = false;
    private _shotSpeed:number = 5;
    private _iterator:number = 0;
    private _invaderOrientation:number = 10;

	constructor() {
        super();

        Global.PIXI_APP.ticker.add(this.ticker, this);
        
        window.addEventListener("keydown",
			(e:KeyboardEvent) => {MainContainer.PLAYER_1
				this.keyDownHandler(e);
            },
        );
            
		window.addEventListener("keyup",
			(e:KeyboardEvent) => {
				this.keyUpHandler(e);
            },
        );
    }

    private keyDownHandler(e:KeyboardEvent):void {
		if (e.code == "ArrowRight") {
			this.BUTTON_RIGHT = true;
		}
		if (e.code == "ArrowLeft") {
			this.BUTTON_LEFT = true;
        }
        if (e.code == "ArrowUp") {
            //отключение выстрелов при удерживании
			if (this.BUTTON_UP == false) {
				this._shotSwitcher = true;
			}
			this.BUTTON_UP = true;
		}
	}

	private keyUpHandler(e:KeyboardEvent):void {
		if (e.code == "ArrowRight") {
			this.BUTTON_RIGHT = false;
		}
		if (e.code == "ArrowLeft") {
			this.BUTTON_LEFT = false;
        }
        if (e.code == "ArrowUp") {
			this.BUTTON_UP = false;
		}
    }
    
    private initialShot():void {
		let shot:Shot = new Shot;
			this.addChild(shot);
			this._shotArray.add(shot);
			shot.x = MainContainer.PLAYER_1.x + (MainContainer.PLAYER_1.width - shot.width)/2 ;
            shot.y = MainContainer.PLAYER_1.y - shot.height;
            
            console.log("размер массива выстрелов => " + this._shotArray.size);
	}
	
    private ticker():void {
        this._iterator += 1;

        //******BUTTON_RIGHT
		if ((MainContainer.PLAYER_1.x + MainContainer.PLAYER_1.width <= MainContainer.WIDTH - this._border)
		&& (this.BUTTON_RIGHT == true)) {
            MainContainer.PLAYER_1.x += 2;
        }

        //******BUTTON_LEFT
		if (MainContainer.PLAYER_1.x >= this._border && this.BUTTON_LEFT == true) {
            MainContainer.PLAYER_1.x -= 2;
        }
        
        //******BUTTON_UP
		if (this.BUTTON_UP == true && this._shotSwitcher == true) {
			this.initialShot();
			this._shotSwitcher = false;
        }
        
        this._shotArray.forEach((shot:Shot)=> {
			shot.y -= this._shotSpeed;
			
			if (shot.y + shot.height <= 0) {
				this.removeChild(shot);
                this._shotArray.delete(shot);
                console.log("размер массива выстрелов => " + this._shotArray.size);
			}
        });
        
        if (this._iterator >= 50){
            //смена направления движения мобов у стен
                if (MainContainer.INVADERS_CONTAINER.x +
                    MainContainer.INVADERS_CONTAINER.width >= MainContainer.WIDTH - 20) {
                    this._invaderOrientation = -10;
                } else if (MainContainer.INVADERS_CONTAINER.x <= 20) {
                    this._invaderOrientation = 10;
                }
                MainContainer.INVADERS_CONTAINER.x += this._invaderOrientation;
                this._iterator = 0;
            }
	}
}