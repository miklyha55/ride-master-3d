import GameEvents from "../enums/GameEvents";
import { _decorator, v2, view, Component, EventTouch, Vec2 } from "cc";

const { ccclass, property } = _decorator;

@ccclass("Joystick")
export class Joystick extends Component {
    @property({}) maxSpeed: number = 0;

    private _startPoint: Vec2 = v2(0, 0);

    onEnable() {
        this._handleSubscription(true);
    }

    onDisable() {
        this._handleSubscription(false);
    }

    private _handleSubscription(active: boolean) {
        const func: string = active ? "on" : "off";

        view[func](GameEvents.ON_TOUCH_DOWN, this.onTouchDown, this);
        view[func](GameEvents.ON_TOUCH_MOVE, this.onTouchMove, this);
        view[func](GameEvents.ON_TOUCH_UP, this.onTouchUp, this);
    }

    private onTouchDown(event: EventTouch) {
        const touchPoint: Vec2 = event.touch.getUILocation();

        this._startPoint = touchPoint;

        view.emit(GameEvents.START);
    }

    private onTouchMove(event: EventTouch) {
        const touchPoint: Vec2 = event.touch.getUILocation();

        const subPoint: Vec2 = v2(
            this._startPoint.x - touchPoint.x,
            this._startPoint.y - touchPoint.y
        );

        const positionY: number = Math.abs(subPoint.y < 0 ? subPoint.y : 0);

        view.emit(
            GameEvents.MOVE,
            this.maxSpeed > positionY ? positionY : this.maxSpeed
        );
    }

    private onTouchUp(event: EventTouch) {
        this.onTouchDown(event);

        view.emit(GameEvents.STOP, 0);
    }
}
