import {actionAdvance, addSp, cycleTurns} from "../scripts/common.js";

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
        this.isOdd = true; // this is the counter for bronya's lightcone.
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

    modifySpeed(percentage, character) {
        character.spd = parseFloat(character.spd) + (character.baseSpd*(percentage/100));
    }

    speedSetEffect(characters) {
        for (let character of characters) {
            character.speedBuffDuration = 1;
            character.modifySpeed(12, character);
        }
    }

    windSetEffect() {
        this.av = actionAdvance(25, this.av, this.spd);
    }

    danceDanceDance(superimposition) {
        for (let character of cycleTurns) {
            character.av = actionAdvance((14 +(2*superimposition)), character.av, character.spd);
        }
    }

    butTheBattleIsntOver() {
        if (this.isOdd) {
            addSp(1);
            this.isOdd = !this.isOdd;
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

export const Lightcones = Object.freeze({
    DDDs1: 1,
    DDDs2: 2,
    DDDs3: 3,
    DDDs4: 4,
    DDDs5: 5,
    BRONYA:6,
    OTHER:-1
});

export const implementedCones = [
    {value:-1, message: "Other"},
    {value: 1, message: "Dance Dance Dance! s1"},
    {value: 2, message: "Dance Dance Dance! s2"},
    {value: 3, message: "Dance Dance Dance! s3"},
    {value: 4, message: "Dance Dance Dance! s4"},
    {value: 5, message: "Dance Dance Dance! s5"},
    {value: 6, message: "But the Battle Isn't Over"}];

export const implementedSupports = [
    "Fu Xuan", "Silver Wolf", "Bronya", "Other"];

export const harmonyUnits = [
    "Sparkle", "Bronya", "Tingyun",
    "Asta", "Ruan Mei", "Yukong", "Hanya"
];