import { Seele } from "../characters/Seele.js";
import { Sparkle } from "../characters/Sparkle.js";
import { Support } from "../characters/Support.js";
import { ArtifactSet } from "../characters/Character.js";

export class Result {
    constructor(seeleSpd, seeleTurns, buffedTurns, message) {
        this.seeleSpd = seeleSpd;
        this.seeleTurns = seeleTurns;
        this.buffedTurns = buffedTurns;
        this.message = message;
    }
}

export let cycle = 0;
export let numCycles = 0;
export let remainingAvThisCycle = 0;
export let cycleTurns = [];
export let dps;
export let sparkle;
export let prioritarySupport;
export let otherSupport;
export let isE2Seele = false;
export let sparkleVonwacq = false;
export let prioSupVonwacq = false;
export let supVonwacq = false;
export let showTurnOrder = false;
export let currentSp = 6;
export let extraMessage = "";
export let turnOrderMessage = "";
export let counter = 0;
export const MAX_SP = 7;

export let results = [];

function adjustAv(amountToSubtract) {
    cycleTurns.sort((a, b) => a.av - b.av);
    for (let character of cycleTurns) {
        character.av = character.av - amountToSubtract;
    }
    remainingAvThisCycle = remainingAvThisCycle - amountToSubtract;
}

export function actionAdvance(percentage, characterCurrentAv, characterSpd) {
    let characterCurrentPosition = characterCurrentAv * characterSpd;
    let amountForwarded = 10_000 * (percentage / 100);
    let characterNewPosition = characterCurrentPosition - amountForwarded;
    if (characterNewPosition < 0 ) { return 0; }
    else return (characterNewPosition / characterSpd);
}

export function calculate(sSpd, hSpd, fSpd, swSpd, cycles, sparkleEr, sparkleDdd, prioSupName,
                          otherSupName, initialEnergyPerc, hSet, prioSupSet, supSet) {
    if (cycles <   1) { cycles =   1; }
    if (cycles >  40) { cycles =  40; }
    initCharacters(sSpd, hSpd, fSpd, swSpd, sparkleEr, sparkleDdd, prioSupName,
        otherSupName, initialEnergyPerc, hSet, prioSupSet, supSet);
    reset(cycles);

    cycleTurns = [dps, sparkle, prioritarySupport, otherSupport];
    cycleTurns = sortWithVonwacq(cycleTurns);
    setInitialSP(cycleTurns);

    while (cycle < numCycles) {
        adjustAv(cycleTurns[0].av);

        while (remainingAvThisCycle > 0) {
            cycleTurns[0].takeTurn();
            cycleTurns.sort((a, b) => a.av - b.av);
            adjustAv((remainingAvThisCycle < cycleTurns[0].av)
                ? remainingAvThisCycle
                : cycleTurns[0].av);
        }
        remainingAvThisCycle = 100;
        cycle++;
    }

    let resultMessage = `<h2>Seele: ${sSpd} spd | Sparkle: ${hSpd} spd</h2>
                <ul>
                    <li>Amount of turns taken by the DPS in ${numCycles} cycles: ${dps.turnsTaken}</li>
                    <li>Buffed turns: ${dps.buffedTurnsTaken}</li>
                    <li>Final SP: ${currentSp}</li>
                    <li>Seele basics: ${dps.basicAttacksUsed}</li>
                    <li>Sparkle basics: ${sparkle.basicAttacksUsed}</li>
                    <li>Additional information: ${extraMessage}</li>`;
    if (showTurnOrder) { resultMessage = resultMessage.concat(`<li>Turn order: <br/>${turnOrderMessage}</li>`) }
    resultMessage = resultMessage.concat(`<br/></ul><br/>`);

    results.push(new Result(sSpd, dps.turnsTaken, dps.buffedTurnsTaken, resultMessage));
    counter++;
}

export function trueFalseButton(e) {
    if (e.target.getAttribute("clicked") === "true") {
        e.target.setAttribute("clicked", "false");
    }
    else { e.target.setAttribute("clicked", "true"); }
    switch (e.target.getAttribute("name")) {
        case "seele": {
            isE2Seele = !isE2Seele;
            return isE2Seele;
        }
        case "turnOrder": {
            showTurnOrder = !showTurnOrder;
            return showTurnOrder;
        }
        case "sparkle": {
            sparkleVonwacq = !sparkleVonwacq;
            return sparkleVonwacq;
        }
        case "prioSup": {
            prioSupVonwacq = !prioSupVonwacq;
            return prioSupVonwacq;
        }
        default: {
            supVonwacq = !supVonwacq;
            return supVonwacq
        }
    }
}

export function showResults(container) {
    let resultsParagraph = document.getElementById("results");
    if (resultsParagraph !== null) { resultsParagraph.remove(); }
    resultsParagraph = document.createElement("p");
    resultsParagraph.setAttribute("id", "results");

    let h1Results = document.getElementById("h1Results");
    if (h1Results !== null) { h1Results.remove(); }
    h1Results = document.createElement("h1");
    h1Results.setAttribute("id", "h1Results");
    h1Results.textContent = "Results";

    let resultSection = document.getElementById("resultSection");
    if (resultSection !== null) { resultSection.remove(); }
    resultSection = document.createElement("section");
    resultSection.setAttribute("id", "resultSection");

    for (let i = 0; i < results.length; i++) {
        resultsParagraph.innerHTML += results[i].message;
    }

    resultSection.append(h1Results, resultsParagraph);
    container.appendChild(resultSection);
}

export function setFooterWidth(main, footer) {
    if (main && main.children.length === 2) {
        footer.classList.add("full-width");
    }
}

function initCharacters(sSpd, hSpd, fSpd, swSpd, sparkleEr, sparkleDdd, prioSupName,
                        otherSupName, initialEnergyPerc, hSet, prioSupSet, supSet) {
    dps = new Seele(sSpd, isE2Seele);
    sparkle = new Sparkle(hSpd, sparkleEr, initialEnergyPerc, hSet, sparkleVonwacq, sparkleDdd);

    prioritarySupport = initializeSupport(prioSupName, fSpd, 100, initialEnergyPerc, prioSupSet, prioSupVonwacq);
    otherSupport = initializeSupport(otherSupName, swSpd, 100, initialEnergyPerc, supSet, supVonwacq);
}

function initializeSupport(name, spd, erPercentage, initialEnergyPerc, prioSupSet, prioSupVonwacq) {
    switch (name) {
        case 'Fu Xuan': return new Support(name, spd, 135, erPercentage, initialEnergyPerc, 100, 'QQE', prioSupSet, prioSupVonwacq);
        case 'Silver Wolf': return new Support(name, spd, 110, erPercentage, initialEnergyPerc, 107, 'EQQ', prioSupSet, prioSupVonwacq);
        // implement Bronya as a separate class.
        // case 'Bronya': return new Support(name, spd, 99, 'E');
        default: return new Support('Default Support', spd, 100, erPercentage, initialEnergyPerc, 100, 'EQQ', prioSupSet, prioSupVonwacq);
    }
}

function reset(cycles) {
    cycle = 0;
    numCycles = cycles;
    remainingAvThisCycle = 150;
    dps.turnsTaken = 0;
    dps.buffedTurnsTaken = 0;
    dps.basicAttacksUsed = 0;
    sparkle.basicAttacksUsed = 0;
    extraMessage = "";
    turnOrderMessage = "";
    dps.turnWillBeBuffed = false;
}

function sortWithVonwacq(characters) {
    for (let character of characters) {
        character.vonwacqEffect();
    }
    return characters.sort((a, b) => a.av - b.av);
}

function setInitialSP(characters) {
    currentSp = 6;
    for (let character of characters) {
        if (character.set === ArtifactSet.EXTRA_SP && currentSp < MAX_SP) {
            currentSp++;
        }
    }
}

export function addSp(amount) { currentSp += amount; }
export function setSp(amount) { currentSp = amount; }
export function getSp() { return currentSp; }

export function getExtraMessage() { return extraMessage; }
export function setExtraMessage(message) { extraMessage = message;}

export function getTurnOrderMessage() { return turnOrderMessage; }
export function setTurnOrderMessage(message) { turnOrderMessage = message; }

export function sortResultsBySeeleTurns() { results = results.sort((a, b) => a.seeleTurns - b.seeleTurns); }
export function resetResults() { results = []; }
export function spliceResults(amount) { results.splice(amount); }
export function filterResults(expectedBuffs, filterCriteria) {
    let maxBuffedTurns;
    if (expectedBuffs === "") {
        maxBuffedTurns = results.reduce((maxResult, currentResult) => {
            return currentResult.buffedTurns > maxResult.buffedTurns ? currentResult : maxResult;
        }, results[0]).buffedTurns - 2;
    }
    else { maxBuffedTurns = expectedBuffs; }
    results = results.filter(result => result.buffedTurns >= maxBuffedTurns);

    if (filterCriteria === "2") {
        results = results.sort((a, b) => {
            // Compare based on buffedTurns in descending order
            if (a.buffedTurns > b.buffedTurns) {
                return -1;
            } else if (a.buffedTurns < b.buffedTurns) {
                return 1;
            } else {
                // If buffedTurns are equal, compare based on seeleTurns in ascending order
                return b.seeleTurns - a.seeleTurns;
            }
        });
    }

    else {
        results = results.sort((a, b) => {
            if (a.seeleTurns > b.seeleTurns) {
                return -1;
            } else if (a.seeleTurns < b.seeleTurns) {
                return 1;
            } else {
                return b.buffedTurns - a.buffedTurns;
            }
        });
    }
}