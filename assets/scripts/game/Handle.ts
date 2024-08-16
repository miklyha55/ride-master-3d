import GameEvents from "../enums/GameEvents";
import { _decorator, tween, v3, view, Component } from "cc";

const { ccclass, property } = _decorator;

@ccclass("Handle")
export class Handle extends Component {
    @property({}) positionYXN: number = 1;

    onEnable() {
        this._handleSubscription(true);
    }

    onDisable() {
        this._handleSubscription(false);
    }

    private _handleSubscription(active: boolean) {
        const func: string = active ? "on" : "off";

        view[func](GameEvents.MOVE, this.onMove, this);
        view[func](GameEvents.STOP, this.onStop, this);
    }

    onMove(positionY: number) {
        if (this.node) {
            this.node.position = v3(0, positionY * this.positionYXN, 0);
        }
    }

    onStop(positionY: number) {
        tween(this.node)
            .to(0.2, { position: v3(0, positionY, 0) })
            .start();
    }
}
