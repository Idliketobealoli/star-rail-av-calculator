class Character {
    constructor(name, spd, spCounter, baseSpd) {
        this.name = name;
        this.spd = spd;
        this.baseSpd = baseSpd;
        this.substatsSpd = spd - baseSpd;
        this.av = 10_000 / spd;
        this.isAtFullSpeed = false;
        this.spdStacks = 0;
        this.ult = 1;
        this.spCounter = spCounter; // 0,1: buff still active, use BA (+1sp). 2: refresh buff (-1sp)
    }

    resetAv() {
        this.av = 10_000 / this.spd;
    }
}

class Result {
    constructor(seeleSpd, seeleTurns, buffedTurns, message) {
        this.seeleSpd = seeleSpd;
        this.seeleTurns = seeleTurns;
        this.buffedTurns = buffedTurns;
        this.message = message;
    }
}

let cycle, numCycles, remainingAvThisCycle, cycleTurns,
    numSeeleTurns, numSeeleBuffedTurns, numSeeleBasics,
    numHanabiBasics, seele, hanabi, fu, sw;
let seeleWillBeBuffed, isE2Seele = false;
let currentSp = 6;
let extraMessage = "";
let counter = 0;
const MAX_SP = 7;
window.results = [];

function reset(cycles) {
    cycle = 0;
    numCycles = cycles;
    remainingAvThisCycle = 150;
    numSeeleTurns = 0;
    numSeeleBuffedTurns = 0;
    numSeeleBasics = 0;
    numHanabiBasics = 0;
    currentSp = 6;
    extraMessage = "";
    seeleWillBeBuffed = false;
}

function adjustAv(amountToSubtract) {
    cycleTurns.sort((a, b) => a.av - b.av);
    for (let character of cycleTurns) {
        character.av = character.av - amountToSubtract;
    }
    remainingAvThisCycle = remainingAvThisCycle - amountToSubtract;
}

function takesTurn(character) {
    if (character.name === "hanabi") {
        hanabiTurn(character);
    }
    else if (character.name === "seele") {
        seeleTurn(character);
    }
    else {
        otherCharacterTurn(character);
    }
}

function otherCharacterTurn(character) {
    if (character.spCounter === 2 && currentSp > 0) {
        currentSp--;
        character.spCounter = 0;
    }
    else {
        currentSp++;
        character.spCounter++;
    }
    character.resetAv();
}

function seeleTurn(character) {
    numSeeleTurns++;
    if (seeleWillBeBuffed) {
        numSeeleBuffedTurns++
        seeleWillBeBuffed = false;
    }
    if (currentSp < 2 && fu.spCounter === 2) {
        currentSp++;
        numSeeleBasics++;
        if (extraMessage === "") {
            extraMessage = `Couldn't use Seele's E at Seele's turn number ${numSeeleTurns}. Cycle ${cycle}`;
        }
        else {
            extraMessage = extraMessage.concat(`<br>Couldn't use Seele's E at Seele's turn number ${numSeeleTurns}. Cycle ${cycle}`);
        }
        seele.av = actionAdvance(20, seele.av, seele.spd);
    }
    else if (!character.isAtFullSpeed && currentSp > 0) {
        currentSp--;
        if (isE2Seele) {
            if (character.spdStacks < 2) {
                character.spdStacks++;
                character.spd =
                    (character.baseSpd*(1+(0.25*character.spdStacks))) + character.substatsSpd;
            }
            else {
                character.isAtFullSpeed = true;
            }
        }
        else {
            character.spd = (character.baseSpd*1.25) + character.substatsSpd;
            character.isAtFullSpeed = true;
        }
    }
    else if (currentSp > 0) {
        currentSp--;
    }
    else {
        currentSp++;
        numSeeleBasics++;
        if (extraMessage === "") {
            extraMessage = `Couldn't use Seele's E at Seele's turn number ${numSeeleTurns}. Cycle ${cycle}`;
        }
        else {
            extraMessage = extraMessage.concat(`<br>Couldn't use Seele's E at Seele's turn number ${numSeeleTurns}. Cycle ${cycle}`);
        }
        seele.av = actionAdvance(20, seele.av, seele.spd);
    }
    character.resetAv();
}

function hanabiTurn(character) {
    if (currentSp < 1 || (currentSp < 2 && fu.spCounter === 2)) {
        currentSp++;
        numHanabiBasics++;
        if (extraMessage === "") {
            extraMessage = `Couldn't use Sparkle's E before Seele's turn number ${numSeeleTurns+1}. Cycle ${cycle}`;
        }
        else {
            extraMessage = extraMessage.concat(`<br>Couldn't use Sparkle's E before Seele's turn number ${numSeeleTurns+1}. Cycle ${cycle}`);
        }
        seeleWillBeBuffed = false;
        ult(character);
    }
    else {
        currentSp--;
        seele.av = actionAdvance(50, seele.av, seele.spd);
        seeleWillBeBuffed = true;
        ult(character);
    }
    character.resetAv();
}

function actionAdvance(percentage, characterCurrentAv, characterSpd) {
    let characterCurrentPosition = characterCurrentAv * characterSpd;
    let amountForwarded = 10_000 * (1 - (percentage / 100));
    let characterNewPosition = characterCurrentPosition - amountForwarded;
    if (characterNewPosition < 0 ) { return 0; }
    else return (characterNewPosition / characterSpd);
}

function ult(character) {
    character.ult++;
    if (character.ult === 3) {
        currentSp +=4;
        if (currentSp > MAX_SP) {
            currentSp = MAX_SP;
        }
        character.ult = 0;
    }
}

function calculate(sSpd, hSpd, fSpd, swSpd, cycles) {
    reset(cycles);
    seele = new Character("seele", sSpd, 0, 115);
    hanabi = new Character("hanabi", hSpd, 0, 101);
    fu = new Character("fu", fSpd, 0, 100);
    sw = new Character("sw", swSpd, 2, 107);

    cycleTurns = [seele, hanabi, fu, sw]
        .sort((a, b) => a.av - b.av);
    while (cycle < numCycles) {
        adjustAv(cycleTurns[0].av);

        while (remainingAvThisCycle > 0) {
            takesTurn(cycleTurns[0]);
            cycleTurns.sort((a, b) => a.av - b.av);
            adjustAv((remainingAvThisCycle < cycleTurns[0].av)
                ? remainingAvThisCycle
                : cycleTurns[0].av);
        }
        remainingAvThisCycle = 100;
        cycle++;
    }

    window.results.push(new Result(sSpd, numSeeleTurns, numSeeleBuffedTurns,
        `<h2>Seele: ${sSpd} spd | Sparkle: ${hSpd} spd</h2>
                <ul>
                    <li>Amount of turns taken by the DPS in ${numCycles} cycles: ${numSeeleTurns}</li>
                    <li>Buffed turns: ${numSeeleBuffedTurns}</li>
                    <li>Final SP: ${currentSp}</li>
                    <li>Seele basics: ${numSeeleBasics}</li>
                    <li>Sparkle basics: ${numHanabiBasics}</li>
                    <li>Additional information: ${extraMessage}</li><br/>
                </ul><br/>`));
    counter++;
}

function changeE2seele(e) {
    if (e.target.getAttribute("clicked") === "true") {
        e.target.setAttribute("clicked", "false");
    }
    else { e.target.setAttribute("clicked", "true"); }
    isE2Seele = !isE2Seele;
    return isE2Seele;
}