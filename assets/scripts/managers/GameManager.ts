import GameEvents from "../enums/GameEvents";
import { _decorator, view, Component } from "cc";

const { ccclass, property } = _decorator;

interface Urls {
    androidUrl: string;
    iosUrl: string;
}

declare global {
    interface Window {
        callSDK: (urls: Urls) => void
    }
}

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
        window.callSDK({
            androidUrl: this.androidUrl,
            iosUrl: this.iosUrl,
        });
    }
}
