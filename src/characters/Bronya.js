import {ArtifactSet, Character, Lightcones} from "./Character.js";
import {
    actionAdvance,
    addSp, cycle,
    cycleTurns, dps, getExtraMessage,
    getSp,
    getTurnOrderMessage,
    prioritarySupport,
    setExtraMessage,
    setTurnOrderMessage
} from "../scripts/common.js";

export class Bronya extends Character {
    constructor(spd, erPercentage, initialEnergyPercent, set, hasVonwacq, lightcone, eidolon) {
        super('Bronya', spd, 99, set, hasVonwacq);
        this.MAX_ENERGY = 120;
        this.basicAttacksUsed = 0;
        this.turnsTaken = 0;
        this.erPercentage = (erPercentage - 100) / 100;
        this.currentEnergy = this.MAX_ENERGY * initialEnergyPercent / 100;
        this.lightcone = lightcone;
        this.eidolon = parseInt(eidolon);
    }

    takeTurn() {
        setTurnOrderMessage(getTurnOrderMessage().concat("Bronya → "));
        if (this.speedBuffDuration > 0) { this.speedBuffDuration--; }
        if (this.speedBuffDuration === 0) { this.resetSpeed(); }
        this.turnsTaken++;
        if (getSp() < 1 || (getSp() < 2 && prioritarySupport.getCurrentAction() === 'E' && cycleTurns[1] === prioritarySupport)) {
            addSp(1);
            this.basicAttacksUsed++;
            setExtraMessage(getExtraMessage().concat(`<br>&nbsp;&nbsp;&nbsp;Couldn't use Bronya's E at turn number ${this.turnsTaken}. Cycle ${cycle+1}.`));
            dps.turnWillBeBuffed = false;
            this.resetAv();
            this.av = actionAdvance(30, this.av, this.spd);
            this.gainEnergy(false);
        }
        else {
            addSp(-1);
            if (this.eidolon >= 1 && Math.random() < 0.5) { addSp(1); } // this achieves the E1 effect.
            dps.av = actionAdvance(100, dps.av, dps.spd);
            dps.turnWillBeBuffed = true;
            if (this.eidolon >= 2) { dps.bronyaE2speedBuffDuration = 3; } // this is her E2. see Seele.js
            this.resetAv();
            this.gainEnergy(true);
        }
        this.ult();
    }

    ult() {
        if (this.currentEnergy >= this.MAX_ENERGY) {
            setTurnOrderMessage(getTurnOrderMessage().concat("ULT [Bronya] → "));
            this.currentEnergy = 5;

            if (this.set === ArtifactSet.SPEED) {
                this.speedSetEffect(cycleTurns);
            }
            if (this.set === ArtifactSet.WIND) {
                this.windSetEffect();
            }
            this.lightconeEffect();
        }
    }

    lightconeEffect(){
        switch (this.lightcone) {
            case Lightcones.DDDs1:
            case Lightcones.DDDs2:
            case Lightcones.DDDs3:
            case Lightcones.DDDs4:
            case Lightcones.DDDs5: {
                this.danceDanceDance(this.lightcone);
                break;
            }
            case Lightcones.BRONYA: {
                this.butTheBattleIsntOver();
                break;
            }
            default: return;
        }
    }

    gainEnergy(usedE) {
        if (usedE) { this.currentEnergy += (30 * (1+this.erPercentage)); }
        else { this.currentEnergy += (20 * (1+this.erPercentage)); }
    }
}