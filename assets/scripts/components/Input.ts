import GameEvents from "../enums/GameEvents";
import { _decorator, view, Component, EventTouch, Node } from "cc";

const { ccclass, property } = _decorator;

@ccclass("Input")
export class Input extends Component {
    @property({ type: GameEvents }) eventHandlerDown = GameEvents.NONE;
    @property({ type: GameEvents }) eventHandlerMove = GameEvents.NONE;
    @property({ type: GameEvents }) eventHandlerUp = GameEvents.NONE;

    onEnable() {
        this._handleEvents(true);
    }

    onDisable() {
        this._handleEvents(false);
    }

    private _handleEvents(active: boolean) {
        const func: string = active ? "on" : "off";

        this.node[func](Node.EventType.TOUCH_START, this.onDown, this);
        this.node[func](Node.EventType.TOUCH_MOVE, this.onMove, this);
        this.node[func](Node.EventType.TOUCH_END, this.onUp, this);
    }

    private onDown(event: EventTouch) {
        view.emit(this.eventHandlerDown, event);
    }

    private onMove(event: EventTouch) {
        view.emit(this.eventHandlerMove, event);
    }

    private onUp(event: EventTouch) {
        view.emit(this.eventHandlerUp, event);
    }
}
