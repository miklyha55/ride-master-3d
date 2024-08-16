import GameEvents from "../enums/GameEvents";
import { _decorator, view, Component } from "cc";

const { ccclass, property } = _decorator;

@ccclass("TriggerToToggle")
export class TriggerToToggle extends Component {
    @property({ type: GameEvents }) triggerEvent = GameEvents.NONE;
    @property({ type: GameEvents }) toggleEvent = GameEvents.NONE;

    @property({}) active: boolean = false;

    onEnable() {
        this._handleEvents(true);
    }

    onDisable() {
        this._handleEvents(false);
    }

    private _handleEvents(active: boolean) {
        const func: string = active ? "on" : "off";

        this.triggerEvent !== GameEvents.NONE &&
            view[func](this.triggerEvent, this.onTriggerEvent, this);
    }

    private onTriggerEvent() {
        this.toggleEvent !== GameEvents.NONE && view.emit(this.toggleEvent, this.active);
    }
}
