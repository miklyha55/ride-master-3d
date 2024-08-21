import GameEvents from "../enums/GameEvents";
import { _decorator, view, Animation, Component, Label } from "cc";

const { ccclass, property } = _decorator;

@ccclass("BarNumber")
export class BarNumber extends Component {
    @property({ type: GameEvents }) triggerEvent = GameEvents.NONE;
    @property({ type: Label }) label: Label | null = null;

    private _value: number = 0;

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
        this._value++;

        if (this.label) {
            this.label.string = String(this._value);
        }

        const animation: Animation = this.node.getComponent(Animation);

        animation && animation.play();
    }
}
