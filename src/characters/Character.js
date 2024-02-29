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
            console.log("Using Vonwacq effect. Current AV = "+this.av);
            this.av = actionAdvance(50, this.av, this.spd);
            console.log("AV after using Vonwacq = "+this.av);
        }
    }

    resetSpeed() {
        this.spd = this.baseSpd + this.substatsSpd;
    }

    modifySpeed(percentage, character) {
        character.spd = parseFloat(character.spd) + (character.baseSpd*(percentage/100));
    }

    speedSetEffect(characters) {
        console.log("Using speed set effect.");
        for (let character of characters) {
            console.log(`${character.name} spd before set effect: ${character.spd}`);
            character.speedBuffDuration = 1;
            character.modifySpeed(12, character);
            console.log(`${character.name} spd after set effect: ${character.spd}`);
        }
    }

    windSetEffect() {
        console.log("Using wind set effect. Current AV = "+this.av);
        this.av = actionAdvance(25, this.av, this.spd);
        console.log("AV after using wind set = "+this.av);
    }

    danceDanceDance(superimposition) {
        for (let character of cycleTurns) {
            console.log(`Superimposition ${superimposition} - advancing ${(14 +(2*superimposition))} %`);
            character.av = actionAdvance((14 +(2*superimposition)), character.av, character.spd);
        }
    }

    setArtifact(set) {
        switch (set) {
            case 1:
                return ArtifactSet.SPEED;
            case 2:
                return ArtifactSet.WIND;
            case 3:
                return ArtifactSet.EXTRA_SP;
            default:
                return ArtifactSet.IRRELEVANT;
        }
    }

    validate() {
        if (this.spd < this.baseSpd) { this.spd = this.baseSpd; }
        if (this.spd > 250) { this.spd = 250; }
    }

    takeTurn() {

    }

    ult() {

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

export const implementedSupports = [
    "Fu Xuan", "Silver Wolf", "Other"];