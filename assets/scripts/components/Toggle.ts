import GameEvents from "../enums/GameEvents";
import { _decorator, view, Component } from "cc";

const { ccclass, property } = _decorator;

@ccclass("Toggle")
export class Toggle extends Component {
    @property({ type: GameEvents }) triggerEvent = GameEvents.NONE;
    
    @property({}) isActive: boolean = false;

    onLoad() {
        this._handleEvents(true);
    }

    onDestroy() {
        this._handleEvents(false);
    }

    start() {
        this.onTriggerEvent(this.isActive);
    }

    private _handleEvents(active: boolean) {
        const func: string = active ? "on" : "off";

        this.triggerEvent != GameEvents.NONE &&
            view[func](this.triggerEvent, this.onTriggerEvent, this);
    }

    private onTriggerEvent(active: boolean) {
        this.node.active = active;
    }
}
