import {ArtifactSet, Character} from './Character.js';
import {
    addSp,
    cycle, cycleTurns,
    getExtraMessage,
    getSp,
    getTurnOrderMessage,
    setExtraMessage,
    setTurnOrderMessage
} from "../scripts/common.js";

export class Support extends Character {
    constructor(name, spd, maxEnergy, erPercentage, initialEnergyPercent, baseSpd, rotation, set, hasVonwacq) {
        super(name, spd, baseSpd, set, hasVonwacq);
        this.MAX_ENERGY = maxEnergy;
        this.rotation = rotation;
        this.currentAction = this.rotation.charAt(0);
        this.rotationIndex = 0;
        this.erPercentage = (erPercentage - 100) / 100;
        this.currentEnergy = this.MAX_ENERGY * initialEnergyPercent / 100;
    }

    takeTurn() {
        setTurnOrderMessage(getTurnOrderMessage().concat(`${this.name} → `));
        if (this.speedBuffDuration > 0) { this.speedBuffDuration-- }
        if (this.speedBuffDuration === 0) { this.resetSpeed(); }

        if (this.currentAction === 'E' && getSp() > 0) {
            addSp(-1);
            this.gainEnergy(2);
        }
        else if (this.currentAction === 'E' && getSp() <= 0) {
            setExtraMessage(getExtraMessage().concat(`<br>&nbsp;&nbsp;&nbsp;Couldn't use ${this.name}'s E at cycle ${cycle+1}.`));
            addSp(1);
            this.gainEnergy(1);
        }
        else {
            addSp(1);
            this.gainEnergy(1);
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

    ult() {
        if (this.currentEnergy >= this.MAX_ENERGY) {
            setTurnOrderMessage(getTurnOrderMessage().concat(`ULT [${this.name}] → `));
            this.currentEnergy = 5;
            if (this.set === ArtifactSet.SPEED) {
                this.speedSetEffect(cycleTurns);
            }
            if (this.set === ArtifactSet.WIND) {
                this.windSetEffect();
            }
        }
    }

    gainEnergy(mode) {
        if (mode === 2 && this.name === 'Fu Xuan') {
            this.currentEnergy += (50 * (1+this.erPercentage));
        }
        else if (mode === 2) {
            this.currentEnergy += (30 * (1+this.erPercentage));
        }
        else { this.currentEnergy += (30 * (1+this.erPercentage)); }
    }

    getCurrentAction() { return this.currentAction; }
}