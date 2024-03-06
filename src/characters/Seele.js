import {ArtifactSet, Character} from './Character.js';
import {
    actionAdvance,
    addSp,
    getSp,
    cycle,
    getExtraMessage,
    setExtraMessage,
    prioritarySupport,
    cycleTurns, setTurnOrderMessage, getTurnOrderMessage
} from "../scripts/common.js";

export class Seele extends Character {
    constructor(spd, isE2) {
        super('Seele', spd, 115, ArtifactSet.IRRELEVANT, false);
        this.isE2 = isE2;
        this.turnsTaken = 0;
        this.buffedTurnsTaken = 0;
        this.turnWillBeBuffed = false;
        this.basicAttacksUsed = 0;
        this.isAtFullSpeed = false;
        this.spdStacks = 0;
    }

    resetSpeed() {
        this.spd = (this.baseSpd*(1+(0.25*this.spdStacks))) + this.substatsSpd;
        if (this.speedBuffDuration > 0) { this.modifySpeed(12); }
        if (this.bronyaE2speedBuffDuration === 1) { this.modifySpeed(30); }
    }

    takeTurn() {
        setTurnOrderMessage(getTurnOrderMessage().concat("Seele → "));
        if (this.speedBuffDuration > 0) { this.speedBuffDuration--; }
        if (this.bronyaE2speedBuffDuration > 0) { this.bronyaE2speedBuffDuration--; }
        this.resetSpeed();

        this.turnsTaken++;
        if (this.turnWillBeBuffed) {
            this.buffedTurnsTaken++;
            this.turnWillBeBuffed = false;
        }

        if (getSp() < 2 && prioritarySupport.getCurrentAction() === 'E' && cycleTurns[1] === prioritarySupport) {
            addSp(1);
            this.basicAttacksUsed++;
            setExtraMessage(getExtraMessage().concat(`<br>&nbsp;&nbsp;&nbsp;Couldn't use Seele's E at turn number ${this.turnsTaken}. Cycle ${cycle+1}.`));
            if (this.bronyaE2speedBuffDuration > 0) { this.bronyaE2speedBuffDuration--; }
            //let previousSpd = this.spd;
            this.resetSpeed();
            this.resetAv();
            this.av = actionAdvance(20, this.av, this.spd);
        }
        else if (!this.isAtFullSpeed && getSp() > 0) {
            addSp(-1);
            if (this.isE2) {
                if (this.spdStacks < 2) {
                    this.spdStacks++;
                    //this.spd =
                    //    (this.baseSpd*(1+(0.25*this.spdStacks))) + this.substatsSpd;
                }
                else {
                    this.isAtFullSpeed = true;
                }
            }
            else {
                this.spdStacks++;
                //this.spd = (this.baseSpd*1.25) + this.substatsSpd;
                this.isAtFullSpeed = true;
            }
            if (this.bronyaE2speedBuffDuration > 0) { this.bronyaE2speedBuffDuration--; }
            this.resetSpeed();
            this.resetAv();
        }
        else if (getSp() > 0) {
            addSp(-1);
            if (this.bronyaE2speedBuffDuration > 0) { this.bronyaE2speedBuffDuration--; }
            this.resetSpeed();
            this.resetAv();
        }
        else {
            addSp(1);
            this.basicAttacksUsed++;
            setExtraMessage(getExtraMessage().concat(`<br>&nbsp;&nbsp;&nbsp;Couldn't use Seele's E at turn number ${this.turnsTaken}. Cycle ${cycle+1}.`));
            if (this.bronyaE2speedBuffDuration > 0) { this.bronyaE2speedBuffDuration--; }
            //let previousSpd = this.spd;
            this.resetSpeed();
            this.resetAv();
            this.av = actionAdvance(20, this.av, this.spd); // use previousSpd if action advance does not occur after speed buff.
        }
        this.ult();
        // TODO: Need testing. Bronya's E2 says:
        // "When using Skill, the target ally's SPD increases by 30% after taking action, lasting for 1 turn."
        // However, if Seele advances herself forward with a basic attack, does the speed buff take effect before
        // or after the action advance from her basic attack?. If the former, this is correct. If the latter, check
        // previous comment.
    }
}