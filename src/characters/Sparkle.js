import { Character } from './Character.js';
import {
    addSp, getSp, cycle, setSp,
    getExtraMessage, setExtraMessage,
    MAX_SP, prioritarySupport, dps, cycleTurns
} from "../scripts/common.js";
import {actionAdvance} from "../scripts/common.js";

export class Sparkle extends Character {
    constructor(spd, erPercentage, initialEnergyPercent, set, hasVonwacq) {
        super('Sparkle', spd, 101, set, hasVonwacq);
        this.MAX_ENERGY = 110;
        this.currentEnergy = 0;
        this.basicAttacksUsed = 0;
        this.turnsTaken = 0;
        this.erPercentage = (erPercentage - 100) / 100;
        this.currentEnergy = this.MAX_ENERGY / initialEnergyPercent;
    }

    takeTurn() {
        setExtraMessage(getExtraMessage().concat(`<br>Sparkle starts turn ${this.turnsTaken}. Cycle ${cycle+1}.`));
        if (this.speedBuffDuration > 0) { this.speedBuffDuration-- }
        if (this.speedBuffDuration === 0) { this.resetSpeed(); }
        this.turnsTaken++;
        if (getSp() < 1 || (getSp() < 2 && prioritarySupport.getCurrentAction() === 'E' && cycleTurns[1] === prioritarySupport)) {
            addSp(1);
            this.basicAttacksUsed++;
            if (getExtraMessage() === "") {
                setExtraMessage(`Couldn't use Sparkle's E at turn number ${this.turnsTaken}. Cycle ${cycle+1}.`);
            }
            else {
                setExtraMessage(getExtraMessage().concat(`<br>Couldn't use Sparkle's E at turn number ${this.turnsTaken}. Cycle ${cycle+1}.`));
            }
            dps.turnWillBeBuffed = false;
        }
        else {
            addSp(-1);
            dps.av = actionAdvance(50, dps.av, dps.spd);
            dps.turnWillBeBuffed = true;
        }
        this.gainEnergy();
        this.resetAv();
        this.ult();
    }

    ult() {
        if (this.currentEnergy >= this.MAX_ENERGY) {
            addSp(4);
            if (getSp() > MAX_SP) {
                setSp(MAX_SP);
            }
            this.currentEnergy = 5;
        }
    }

    gainEnergy() {
        this.currentEnergy += (30 * (1+this.erPercentage));
    }
}