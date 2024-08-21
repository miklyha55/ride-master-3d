import GameEvents from "../enums/GameEvents";
import { _decorator, v3, view, AudioSource, BoxCollider, Component } from "cc";

const { ccclass } = _decorator;

@ccclass("Coin")
export class Coin extends Component {
    start() {
        const collider: BoxCollider = this.node.getComponent(BoxCollider);
        collider.on("onTriggerEnter", this.onTriggerEnter, this);
    }

    private onTriggerEnter() {
        this.node.parent.getComponent(AudioSource).play();

        view.emit(GameEvents.MOVE_TO_BAR, v3(100, 100, 0), () => {
            view.emit(GameEvents.INC_BAR_NUMBER);
        });

        this.node.destroy();
    }
}
