import GameEvents from "../enums/GameEvents";
import { _decorator, view, Component } from "cc";

const { ccclass } = _decorator;

@ccclass("Game")
export class Game extends Component {
    onEnable() {
        this._handleSubscription(true);
    }

    onDisable() {
        this._handleSubscription(false);
    }

    private _handleSubscription(active: boolean) {
        const func: string = active ? "on" : "off";

        view[func](GameEvents.COMPLETE, this.onComplete, this);
    }

    private onComplete() {
        view.emit(GameEvents.TOGGLE_UI_ELEMENTS, false);

        this.scheduleOnce(() => {
            view.emit(GameEvents.TOGGLE_PACKSHOT, true);
        }, 1);
    }
}
