import {
    _decorator,
    math,
    screen,
    v2,
    view,
    Component,
    UITransform,
    Vec2,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("ResizeProps")
class ResizeProps {
    @property({}) isPosition: boolean = false;

    @property({
        visible() {
            return this.isPosition;
        },
    })
    isRelative: boolean = false;

    @property({
        visible() {
            return this.isRelative && this.isPosition;
        },
    })
    relativePosition: Vec2 = v2(0, 0);

    @property({
        visible() {
            return !this.isRelative && this.isPosition;
        },
    })
    absolutePosition: Vec2 = v2(0, 0);

    @property({}) isAnchor: boolean = false;

    @property({
        visible() {
            return this.isAnchor;
        },
    })
    anchor: Vec2 = v2(0.5, 0.5);

    @property({}) isScale: boolean = false;

    @property({
        visible() {
            return this.isScale;
        },
    })
    scale: Vec2 = v2(1, 1);
}

@ccclass("Resize")
export class Resize extends Component {
    @property({ type: ResizeProps }) landscape: ResizeProps | null = null;
    @property({ type: ResizeProps }) portrait: ResizeProps | null = null;

    onEnable() {
        this._handleSubscription(true);
    }

    onDisable() {
        this._handleSubscription(false);
    }

    onLoad() {
        this.onSizeChange();
    }

    private _handleSubscription(active: boolean) {
        const func: string = active ? "on" : "off";

        view[func]("canvas-resize", this.onSizeChange, this);
    }

    private _getRelativePosition(
        relativePosition: Vec2,
        width: number,
        height: number
    ) {
        const x: number = width * relativePosition.x - width / 2;
        const y: number = height / 2 - height * relativePosition.y;

        return v2(x, y);
    }

    private onSizeChange() {
        let { width, height }: math.Size = screen.resolution;

        width /= view.getScaleX();
        height /= view.getScaleY();

        const isLandscape: boolean = width > height;

        const resizeProps: ResizeProps | null = isLandscape
            ? this.landscape
            : this.portrait;

        if (resizeProps === null) {
            return;
        }

        const uITransform: UITransform = this.node.getComponent(UITransform);

        if (resizeProps.isAnchor && uITransform) {
            uITransform.setAnchorPoint(
                resizeProps.anchor.x,
                resizeProps.anchor.y
            );
        }

        if (resizeProps.isPosition) {
            const relativePosition: Vec2 = this._getRelativePosition(
                resizeProps.relativePosition,
                width,
                height
            );

            this.node.setPosition(
                !resizeProps.isRelative
                    ? resizeProps.absolutePosition.x
                    : relativePosition.x,
                !resizeProps.isRelative
                    ? resizeProps.absolutePosition.y
                    : relativePosition.y
            );
        }

        if (resizeProps.isScale) {
            this.node.setScale(resizeProps.scale.x, resizeProps.scale.y);
        }
    }
}
