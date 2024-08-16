import {
    _decorator,
    math,
    screen,
    v3,
    Camera,
    Component,
    Node,
    UITransform,
    Vec3,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("CameraManager")
export class CameraManager extends Component {
    @property({ type: Node }) cameraBox: Node | null = null;
    @property({ type: Node }) target: Node | null = null;
    @property({
        visible() {
            return this.target;
        },
    })
    offset: Vec3 = v3(0, 0, 0);

    private _uITransformCameraBoxParent: UITransform | void = undefined;
    private _uITransformTargetParent: UITransform | void = undefined;

    private _camera: Camera | void = undefined;
    private _scale: number = 0;

    private _isStart: boolean = false;

    onLoad() {
        this._camera = this.node.getComponent(Camera);

        this._uITransformCameraBoxParent =
            this.cameraBox?.parent?.getComponent(UITransform);

        this._uITransformTargetParent =
            this.target?.parent?.getComponent(UITransform);
    }

    update() {
        this._updatePosition();
        this._updateFov();
        this._updateEuler();

        if (!this._isStart) {
            this._isStart = true;
        }
    }

    _updateEuler() {
        if (this._camera) {
            this._camera.node.lookAt(this.target.worldPosition);
        }
    }

    _updateFov() {
        const { width, height }: math.Size = screen.resolution;

        const tw = width / this.cameraBox.scale.x;
        const th = height / this.cameraBox.scale.y;
        const gw = width;
        const gh = height;
        const zX = gw / tw;
        const zY = gh / th;

        this._scale = zX < zY ? zX : zY;

        if (this._camera) {
            this._camera.fov = this._scale * 45;
        }
    }

    _updatePosition() {
        if (!this._uITransformCameraBoxParent) {
            return;
        }

        const position = this._uITransformCameraBoxParent.convertToNodeSpaceAR(
            this.cameraBox.worldPosition.add(this.offset)
        );

        position.add(
            this._uITransformTargetParent
                ? this._uITransformTargetParent.convertToNodeSpaceAR(
                      this.target.worldPosition
                  )
                : Vec3.ZERO
        );

        if (this._camera) {
            this._camera.node.position = this._isStart
                ? this._camera.node.position.lerp(position, 0.5)
                : position;
        }
    }
}
