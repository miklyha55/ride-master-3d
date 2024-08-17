import { _decorator, AudioSource, BoxCollider, Component, RigidBody } from "cc";

const { ccclass, property } = _decorator;

@ccclass("Platform")
export class Platform extends Component {
    @property({}) delay: number = 0;

    start() {
        const collider: BoxCollider = this.node.getComponent(BoxCollider);
        collider.on("onTriggerEnter", this.onTriggerEnter, this);
    }

    private onTriggerEnter() {
        this.scheduleOnce(() => {
            this.node.getComponent(AudioSource).play();

            this.node.getComponent(RigidBody).linearDamping = 0.1;
            this.node.getComponent(RigidBody).angularDamping = 0.1;

            this.node.getComponent(RigidBody).useGravity = true;
        }, this.delay);
    }
}
