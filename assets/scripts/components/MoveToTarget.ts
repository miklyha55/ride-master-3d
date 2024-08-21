import GameEvents from "../enums/GameEvents";
import {
    _decorator,
    instantiate,
    tween,
    view,
    Component,
    Node,
    NodePool,
    Prefab,
    UITransform,
    Vec3,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("PLayClip")
export class PLayClip extends Component {
    @property({ type: Node }) target: Node | null = null;
    @property({ type: GameEvents }) triggerEvent = GameEvents.NONE;
    @property({ type: Prefab }) prefab: Prefab | null = null;

    private _nodePool: NodePool | null = null;

    onEnable() {
        this._handleEvents(true);
    }

    onDisable() {
        this._handleEvents(false);
    }

    onLoad() {
        this._nodePool = new NodePool();

        for (let i = 0; i < 5; ++i) {
            this._nodePool.put(instantiate(this.prefab));
        }
    }

    private _handleEvents(active: boolean) {
        const func: string = active ? "on" : "off";

        this.triggerEvent != GameEvents.NONE &&
            view[func](this.triggerEvent, this.onTriggerEvent, this);
    }

    private onTriggerEvent(position: Vec3, callback: () => void) {
        if (!this.prefab) {
            return;
        }

        let node: Node | null = null;

        if (this._nodePool.size() > 0) {
            node = this._nodePool.get();
        } else {
            node = instantiate(this.prefab);
        }

        node.parent = this.node;
        node.position = position;

        const endPosition: Vec3 = this.node
            .getComponent(UITransform)
            .convertToNodeSpaceAR(this.target.worldPosition);

        tween(node)
            .to(0.5, { position: endPosition })
            .call(() => {
                this._nodePool.put(node);
                callback instanceof Function && callback();
            })
            .start();
    }
}
