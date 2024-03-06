import {ArtifactSet, Character, Lightcones} from './Character.js';
import {
    addSp, getSp, cycle,
    getExtraMessage, setExtraMessage, actionAdvance,
    prioritarySupport, dps, cycleTurns, setTurnOrderMessage, getTurnOrderMessage, setMaxSp
} from "../scripts/common.js";

export class Sparkle extends Character {
    constructor(spd, erPercentage, initialEnergyPercent, set, hasVonwacq, lightcone, isE4) {
        super('Sparkle', spd, 101, set, hasVonwacq);
        this.MAX_ENERGY = 110;
        this.basicAttacksUsed = 0;
        this.turnsTaken = 0;
        this.erPercentage = (erPercentage - 100) / 100;
        this.currentEnergy = this.MAX_ENERGY * initialEnergyPercent / 100;
        this.lightcone = lightcone;
        this.isE4 = isE4;

        this.setSp();
    }

    setSp() { this.isE4 ? setMaxSp(8) : setMaxSp(7); }

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
            this.isE4 ? addSp(5) : addSp(4);
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

    gainEnergy() {
        this.currentEnergy += (30 * (1+this.erPercentage));
    }
}