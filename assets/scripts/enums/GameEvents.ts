import { Enum } from "cc";

const GameEvents = Enum({
    NONE: 0,
    START: 10,
    MOVE: 20,
    STOP: 30,
    ON_TOUCH_DOWN: 40,
    ON_TOUCH_MOVE: 50,
    ON_TOUCH_UP: 60,
    REDIRECT: 70,
    TOGGLE_UI_ELEMENTS: 80,
    TOGGLE_PACKSHOT: 90,
    TOGGLE_HAND: 100,
    SHOW_HAND: 110,
    INC_BAR_NUMBER: 120,
    COMPLETE: 130,
    MOVE_TO_BAR: 140,
});

export default GameEvents;
