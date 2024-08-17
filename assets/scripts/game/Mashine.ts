import GameEvents from "../enums/GameEvents";
import {
    _decorator,
    v3,
    view,
    randomRange,
    AudioSource,
    Component,
    Node,
    RigidBody,
    Vec3,
    ITriggerEvent,
    BoxCollider,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("Mashine")
export class Mashine extends Component {
    @property({ type: [Node] }) anyParts: Node[] = [];

    @property({ type: Node }) frontWheel: Node | null = null;
    @property({ type: Node }) backWheel: Node | null = null;
    @property({ type: Node }) booster: Node | null = null;

    @property({}) speedXN: number = 1;
    @property({}) rotationWheelsXN: number = 1;
    @property({}) rotationBoosterXN: number = 1;

    private _speed: number = 0;

    private _isComplete: boolean = false;
    private _isMove: boolean = false;
    private _audioSources: AudioSource[] = [];

    onEnable() {
        this._handleSubscription(true);
    }

    onDisable() {
        this._handleSubscription(false);
    }

    update() {
        if (this._isMove && !this._isComplete) {
            this._updateSpeed();
            this._updateWheelsRotation();
            this._engineValume();
        }
    }

    start() {
        const collider: BoxCollider = this.node.getComponent(BoxCollider);
        collider.on("onTriggerEnter", this.onTriggerEnter, this);

        this._audioSources = this.node.getComponents(AudioSource);
    }

    private onTriggerEnter(event: ITriggerEvent) {
        if (event.otherCollider.node.name === "Crash") {
            view.emit(GameEvents.COMPLETE);

            this._audioSources[0].stop();
            this._audioSources[1].play();

            this._isComplete = true;
            this._stop();

            this.anyParts.forEach((part: Node) => {
                const body: RigidBody = part.getComponent(RigidBody);

                body.enabled = true;
                body.getComponent(RigidBody).setLinearVelocity(
                    v3(randomRange(-150, 150), randomRange(0, -100), 0)
                );

                part.getComponent(BoxCollider).enabled = true;
            });
        }
    }

    private _handleSubscription(active: boolean) {
        const func: string = active ? "on" : "off";

        view[func](GameEvents.START, this.onStart, this);
        view[func](GameEvents.MOVE, this.onMove, this);
        view[func](GameEvents.STOP, this.onStop, this);
    }

    private _stop() {
        this._isMove = false;
        this.node.getComponent(RigidBody).setLinearVelocity(v3(0, 0, 0));
    }

    private _engineValume() {
        this._audioSources[0].volume = this._speed / 100;
    }

    private _updateSpeed() {
        this.node
            .getComponent(RigidBody)
            .setLinearVelocity(this._speedToVelocity(this._speed));
    }

    private _updateWheelsRotation() {
        if (this.frontWheel && this.backWheel && this.booster) {
            this.frontWheel.eulerAngles = this.frontWheel.eulerAngles.add(
                this._speedToRotation(
                    this._speed,
                    v3(0, 1, 0),
                    this.rotationWheelsXN
                )
            );

            this.backWheel.eulerAngles = this.backWheel.eulerAngles.add(
                this._speedToRotation(
                    this._speed,
                    v3(0, 1, 0),
                    this.rotationWheelsXN
                )
            );

            this.booster.eulerAngles = this.booster.eulerAngles.add(
                this._speedToRotation(
                    this._speed,
                    v3(1, 0, 0),
                    this.rotationBoosterXN
                )
            );
        }
    }

    private _speedToVelocity(speed: number) {
        const linearVelocity: Vec3 = v3(0, 0, 0);

        this.node.getComponent(RigidBody).getLinearVelocity(linearVelocity);

        return v3(speed * this.speedXN, linearVelocity.y, linearVelocity.z);
    }

    private _speedToRotation(speed: number, axis: Vec3, rotationXN: number) {
        return v3(
            axis.x * speed * rotationXN,
            axis.y * speed * rotationXN,
            axis.z * speed * rotationXN
        );
    }

    private _braking() {
        this._speed -= 5;

        if (this._speed <= 0) {
            this._speed = 0;
            this._stop();
            this.unschedule(this._braking);
        }
    }

    private onStart() {
        this._audioSources[0].play();
        this.unschedule(this._braking);
        this._isMove = true;
    }

    private onStop() {
        this._audioSources[0].stop();
        this.schedule(this._braking, 0.001);
    }

    private onMove(speed: number) {
        this._speed = speed;
    }
}
