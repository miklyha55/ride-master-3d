import GameEvents from "../enums/GameEvents";
import { _decorator, view, Component } from "cc";

const { ccclass, property } = _decorator;

@ccclass("ScheduleOnce")
export class ScheduleOnce extends Component {
    @property({}) isStartFromEnable: boolean = false;

    @property({ type: GameEvents }) triggerEvent = GameEvents.NONE;
    @property({ type: GameEvents }) handleEvent = GameEvents.NONE;

    @property({}) delay: number = 1;

    onEnable() {
        this.isStartFromEnable && this.onTriggerEvent();
        this._handleEvents(true);
    }

    onDisable() {
        this._handleEvents(false);
    }

    private _handleEvents(active: boolean) {
        const func: string = active ? "on" : "off";

        this.triggerEvent !== GameEvents.NONE &&
            view[func](this.triggerEvent, this.onTriggerEvent, this);
    }

    private _scheduleOnceHandler() {
        this.handleEvent !== GameEvents.NONE && view.emit(this.handleEvent);
    }

    private onTriggerEvent() {
        this.unschedule(this._scheduleOnceHandler);
        this.scheduleOnce(this._scheduleOnceHandler, this.delay);
    }
}
