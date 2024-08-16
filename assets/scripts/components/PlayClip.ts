import GameEvents from "../enums/GameEvents";
import { _decorator, view, Animation, AnimationClip, Component } from "cc";

const { ccclass, property } = _decorator;

@ccclass("PLayClip")
export class PLayClip extends Component {
    @property({}) isStartFromEnable: boolean = false;

    @property({ type: GameEvents }) triggerEvent = GameEvents.NONE;
    @property({ type: AnimationClip }) animationClip: AnimationClip | null =
        null;
    @property({}) isAdditive: boolean = false;

    onEnable() {
        this.isStartFromEnable && this.onTriggerEvent();
        this._handleEvents(true);
    }

    onDisable() {
        this._handleEvents(false);
    }

    private _handleEvents(active: boolean) {
        const func: string = active ? "on" : "off";

        this.triggerEvent != GameEvents.NONE &&
            view[func](this.triggerEvent, this.onTriggerEvent, this);
    }

    private onTriggerEvent() {
        const animation = this.node.getComponent(Animation);

        if (animation && this.animationClip) {
            animation[this.isAdditive ? "playAdditive" : "play"](
                this.animationClip.name
            );
        }
    }
}
