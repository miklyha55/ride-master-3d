import GameEvents from "../enums/GameEvents";
import { _decorator, v3, view, AudioSource, BoxCollider, Component, RigidBody } from "cc";

const { ccclass } = _decorator;

@ccclass("Coin")
export class Coin extends Component {
    start() {
        const collider: BoxCollider = this.node.getComponent(BoxCollider);
        collider.on("onTriggerEnter", this.onTriggerEnter, this);
    }

    private onTriggerEnter() {
        this.node.getComponent(AudioSource).play();
        view.emit(GameEvents.INC_BAR_NUMBER);
        
        this.node
            .getComponent(RigidBody)
            .getComponent(RigidBody)
            .setLinearVelocity(v3(0, 300, 0));

        this.scheduleOnce(() => {
            this.node.destroy();
        }, 1);
    }
}
