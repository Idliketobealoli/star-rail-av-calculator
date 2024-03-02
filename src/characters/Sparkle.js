import {ArtifactSet, Character} from './Character.js';
import {
    addSp, getSp, cycle, setSp,
    getExtraMessage, setExtraMessage,
    MAX_SP, prioritarySupport, dps, cycleTurns, setTurnOrderMessage, getTurnOrderMessage
} from "../scripts/common.js";
import {actionAdvance} from "../scripts/common.js";

export class Sparkle extends Character {
    constructor(spd, erPercentage, initialEnergyPercent, set, hasVonwacq, ddd) {
        super('Sparkle', spd, 101, set, hasVonwacq);
        this.MAX_ENERGY = 110;
        this.currentEnergy = 0;
        this.basicAttacksUsed = 0;
        this.turnsTaken = 0;
        this.erPercentage = (erPercentage - 100) / 100;
        this.currentEnergy = this.MAX_ENERGY * initialEnergyPercent / 100;
        this.ddd = ddd;
    }

    takeTurn() {
        setTurnOrderMessage(getTurnOrderMessage().concat("Sparkle → "));
        if (this.speedBuffDuration > 0) { this.speedBuffDuration-- }
        if (this.speedBuffDuration === 0) { this.resetSpeed(); }
        this.turnsTaken++;
        if (getSp() < 1 || (getSp() < 2 && prioritarySupport.getCurrentAction() === 'E' && cycleTurns[1] === prioritarySupport)) {
            addSp(1);
            this.basicAttacksUsed++;
            setExtraMessage(getExtraMessage().concat(`<br>&nbsp;&nbsp;&nbsp;Couldn't use Sparkle's E at turn number ${this.turnsTaken}. Cycle ${cycle+1}.`));
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
            setTurnOrderMessage(getTurnOrderMessage().concat("ULT [Sparkle] → "));
            addSp(4);
            if (getSp() > MAX_SP) {
                setSp(MAX_SP);
            }
            this.currentEnergy = 5;

            if (this.set === ArtifactSet.SPEED) {
                this.speedSetEffect(cycleTurns);
            }
            if (this.set === ArtifactSet.WIND) {
                this.windSetEffect();
            }
            if (this.ddd !== null && this.ddd >= 1 && this.ddd <= 5) {
                this.danceDanceDance(this.ddd);
            }
        }
    }

    gainEnergy() {
        this.currentEnergy += (30 * (1+this.erPercentage));
    }
}