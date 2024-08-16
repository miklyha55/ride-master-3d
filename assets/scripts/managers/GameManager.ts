import GameEvents from "../enums/GameEvents";
import { _decorator, view, Component } from "cc";

const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
    @property({}) iosUrl: string = "";
    @property({}) androidUrl: string = "";

    onEnable() {
        this._handleEvents(true);
    }

    onDisable() {
        this._handleEvents(false);
    }

    private _handleEvents(active: boolean) {
        const func: string = active ? "on" : "off";

        view[func](GameEvents.REDIRECT, this.onRedirect, this);
    }

    onRedirect() {
        const userAgent: string =
            window.navigator.userAgent || window.navigator.vendor;
        const isAndroid: boolean = /android/i.test(userAgent);
        const url = isAndroid ? this.iosUrl : this.androidUrl;

        if (isAndroid) {
            window.open(url, "_blank");
        } else {
            window.location.href = url;
        }
    }
}
