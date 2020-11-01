import { Container } from "pixi.js";
import MainContainer from "./MainContainer";

export default class Controller extends Container {
    public static BUTTON_LEFT:boolean = false;
    public static BUTTON_RIGHT:boolean = false;
    public static BUTTON_UP:boolean = false;

	constructor() {
        super();

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
			Controller.BUTTON_RIGHT = true;
		}
		if (e.code == "ArrowLeft") {
			Controller.BUTTON_LEFT = true;
        }
        if (e.code == "ArrowUp") {
            //отключение выстрелов при удерживании
			if (Controller.BUTTON_UP == false) {
				MainContainer.SHOT_SWITCHER = true;
			}
			Controller.BUTTON_UP = true;
		}
	}

	private keyUpHandler(e:KeyboardEvent):void {
		if (e.code == "ArrowRight") {
			Controller.BUTTON_RIGHT = false;
		}
		if (e.code == "ArrowLeft") {
			Controller.BUTTON_LEFT = false;
        }
        if (e.code == "ArrowUp") {
			Controller.BUTTON_UP = false;
		}
    }
}