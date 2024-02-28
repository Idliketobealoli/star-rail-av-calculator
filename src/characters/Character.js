import {actionAdvance, cycleTurns} from "../scripts/common.js";

export class Character {
    constructor(name, spd, baseSpd, set, hasVonwacq) {
        this.name = name;
        this.spd = spd;
        this.baseSpd = baseSpd;
        this.substatsSpd = spd - baseSpd;
        this.av = 10_000 / spd;
        this.set = this.setArtifact(set);
        this.hasVonwacq = hasVonwacq;
        this.speedBuffDuration = 0;
        this.validate();
    }

    resetAv() {
        this.av = 10_000 / this.spd;
    }

    vonwacqEffect() {
        if (this.hasVonwacq) {
            this.av = actionAdvance(50, this.av, this.spd);
        }
    }

    resetSpeed() {
        this.spd = this.baseSpd + this.substatsSpd;
    }

    modifySpeed(percentage) {
        this.spd = this.spd + (this.baseSpd*(percentage/100));
    }

    speedSetEffect(characters) {
        for (let character of characters) {
            character.speedBuffDuration = 1;
            character.modifySpeed(12);
        }
    }

    windSetEffect() {
        this.av = actionAdvance(25, this.av, this.spd);
    }

    setArtifact(set) {
        switch (set) {
            case 1: return ArtifactSet.SPEED;
            case 2: return ArtifactSet.WIND;
            case 3: return ArtifactSet.EXTRA_SP;
            default: return ArtifactSet.IRRELEVANT;
        }
    }

    validate() {
        if (this.spd < this.baseSpd) { this.spd = this.baseSpd; }
        if (this.spd > 250) { this.spd = 250; }
    }

    takeTurn() {

    }

    ult() {
        if (this.set === ArtifactSet.SPEED) {
            this.speedSetEffect(cycleTurns);
        }
        if (this.set === ArtifactSet.WIND) {
            this.windSetEffect();
        }
    }
}

export const ArtifactSet = Object.freeze({
    SPEED: 1,
    WIND: 2,
    EXTRA_SP: 3,
    IRRELEVANT: -1
});

export const implementedSets = [
    {value:-1, message: "Other"},
    {value: 1, message: "4pc Messenger Traversing Hackerspace"},
    {value: 2, message: "4pc Eagle of Twilight Line"},
    {value: 3, message: "4pc Passerby of Wandering Cloud"}];