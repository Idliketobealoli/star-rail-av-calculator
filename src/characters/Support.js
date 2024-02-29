import { Character } from './Character.js';
import {
    addSp,
    cycle,
    getExtraMessage,
    getSp,
    getTurnOrderMessage,
    setExtraMessage,
    setTurnOrderMessage
} from "../scripts/common.js";

export class Support extends Character {
    constructor(name, spd, baseSpd, rotation, set, hasVonwacq) {
        super(name, spd, baseSpd, set, hasVonwacq);
        this.rotation = rotation;
        this.currentAction = this.rotation.charAt(0);
        this.rotationIndex = 0;
    }

    takeTurn() {
        setTurnOrderMessage(getTurnOrderMessage().concat(`${this.name} → `));
        if (this.speedBuffDuration > 0) { this.speedBuffDuration-- }
        if (this.speedBuffDuration === 0) { this.resetSpeed(); }

        if (this.currentAction === 'E' && getSp() > 0) {
            addSp(-1);
        }
        else if (this.currentAction === 'E' && getSp() <= 0) {
            setExtraMessage(getExtraMessage().concat(`<br>&nbsp;&nbsp;&nbsp;Couldn't use ${this.name}'s E at cycle ${cycle+1}.`));
            addSp(1);
        }
        else {
            addSp(1);
        }
        this.moveRotationIndex();
        this.resetAv();
        this.ult();
    }

    moveRotationIndex() {
        this.rotationIndex++;
        if (this.rotationIndex >= this.rotation.length) {
            this.rotationIndex = 0;
        }
        this.currentAction = this.rotation.charAt(this.rotationIndex);
    }

    getCurrentAction() { return this.currentAction; }
}