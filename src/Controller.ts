import { Container } from "pixi.js";
import Global from "./Global";
import MainContainer from "./MainContainer";

export default class Controller extends Container {
    private BUTTON_LEFT:boolean = false;
    private BUTTON_RIGHT:boolean = false;
    private _border:number = 10;

	constructor() {
        super();

        Global.PIXI_APP.ticker.add(this.ticker, this);
        
        window.addEventListener("keydown",
			(e:KeyboardEvent) => {MainContainer.PLAYER_1
				this.keyDownHandler(e);
            },);
            
		window.addEventListener("keyup",
			(e:KeyboardEvent) => {
				this.keyUpHandler(e);
			},);
    }

    private keyDownHandler(e:KeyboardEvent):void {
		if (e.code == "ArrowRight") {
			this.BUTTON_RIGHT = true;
		}
		if (e.code == "ArrowLeft") {
			this.BUTTON_LEFT = true;
		}
	}

	private keyUpHandler(e:KeyboardEvent):void {
		if (e.code == "ArrowRight") {
			this.BUTTON_RIGHT = false;
		}
		if (e.code == "ArrowLeft") {
			this.BUTTON_LEFT = false;
		}
	}
	
    private ticker():void {

        //******BUTTON_RIGHT
		if ((MainContainer.PLAYER_1.x + MainContainer.PLAYER_1.width <= MainContainer.WIDTH - this._border)
		&& (this.BUTTON_RIGHT == true)) {
            MainContainer.PLAYER_1.x += 2;
        }

        //******BUTTON_LEFT
		if (MainContainer.PLAYER_1.x >= this._border && this.BUTTON_LEFT == true) {
            MainContainer.PLAYER_1.x -= 2;
		}
	}
}