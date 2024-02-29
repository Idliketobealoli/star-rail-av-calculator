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
    }

    takeTurn() {
        setTurnOrderMessage(getTurnOrderMessage().concat("Seele → "));
        if (this.speedBuffDuration > 0) { this.speedBuffDuration-- }
        if (this.speedBuffDuration === 0) { this.resetSpeed(); }
        this.turnsTaken++;
        if (this.turnWillBeBuffed) {
            this.buffedTurnsTaken++;
            this.turnWillBeBuffed = false;
        }

        if (getSp() < 2 && prioritarySupport.getCurrentAction() === 'E' && cycleTurns[1] === prioritarySupport) {
            addSp(1);
            this.basicAttacksUsed++;
            setExtraMessage(getExtraMessage().concat(`<br>&nbsp;&nbsp;&nbsp;Couldn't use Seele's E at turn number ${this.turnsTaken}. Cycle ${cycle+1}.`));
            this.resetAv();
            this.av = actionAdvance(20, this.av, this.spd);
        }
        else if (!this.isAtFullSpeed && getSp() > 0) {
            addSp(-1);
            if (this.isE2) {
                if (this.spdStacks < 2) {
                    this.spdStacks++;
                    this.spd =
                        (this.baseSpd*(1+(0.25*this.spdStacks))) + this.substatsSpd;
                }
                else {
                    this.isAtFullSpeed = true;
                }
            }
            else {
                this.spdStacks++;
                this.spd = (this.baseSpd*1.25) + this.substatsSpd;
                this.isAtFullSpeed = true;
            }
            this.resetAv();
        }
        else if (getSp() > 0) {
            addSp(-1);
            this.resetAv();
        }
        else {
            addSp(1);
            this.basicAttacksUsed++;
            setExtraMessage(getExtraMessage().concat(`<br>&nbsp;&nbsp;&nbsp;Couldn't use Seele's E at turn number ${this.turnsTaken}. Cycle ${cycle+1}.`));
            this.resetAv();
            this.av = actionAdvance(20, this.av, this.spd);
        }
        this.ult();
    }
}