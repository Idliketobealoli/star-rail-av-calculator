import {
    calculate,
    changeE2seele,
    filterResults,
    resetResults,
    setFooterWidth,
    showResults,
    spliceResults
} from "./common.js";

{
    let button, inputFuSpd, main, footer,
        inputSwSpd, inputCycles, inputMaxSeeleSpd,
        inputMinSeeleSpd, inputMinHanabiSpd,
        inputMaxHanabiSpd, inputExpectedBuffs,
        filterCriteria, inputResultsAmount, e2seele;

    function start() {
        button = document.getElementById("calculate");
        inputMinSeeleSpd = document.getElementById("seeleMinSpd");
        inputMaxSeeleSpd = document.getElementById("seeleMaxSpd");
        inputMinHanabiSpd = document.getElementById("hanabiMinSpd");
        inputMaxHanabiSpd = document.getElementById("hanabiMaxSpd");
        inputExpectedBuffs = document.getElementById("buffedExpected");
        inputFuSpd = document.getElementById("fuSpd");
        inputSwSpd = document.getElementById("swSpd");
        inputCycles = document.getElementById("cycles");
        filterCriteria = document.getElementById("criteria");
        inputResultsAmount = document.getElementById("resultsAmount");
        e2seele = document.getElementById("e2Seele");
        main = document.getElementById("main");
        footer = document.getElementById("footer");

        e2seele.addEventListener("click", changeE2seele);
        button.addEventListener("click", simulate);
    }

    function simulate() {
        resetResults();
        validateSimulation();
        runSimulations();
        filterResults(inputExpectedBuffs.value, filterCriteria.value);

        if (inputResultsAmount.value  === "" || inputResultsAmount.value < 1) { inputResultsAmount.value = 10; }
        if (inputResultsAmount.value  > 50) { inputResultsAmount.value = 50; }
        spliceResults(inputResultsAmount.value);

        showResults(main);
        setFooterWidth(main, footer);
    }

    function validateSimulation() {
        if (inputFuSpd.value        === "" ||
            inputSwSpd.value        === "" ||
            inputCycles.value       === "") { return; }
        if (inputMinHanabiSpd.value === "" || inputMinHanabiSpd.value < 101) { inputMinHanabiSpd.value = 101; }
        if (inputMaxHanabiSpd.value === "" || inputMaxHanabiSpd.value > 200) { inputMaxHanabiSpd.value = 200; }
        if (inputMinSeeleSpd.value  === "" || inputMinSeeleSpd.value  < 115) { inputMinSeeleSpd.value = 115; }
        if (inputMaxSeeleSpd.value  === "" || inputMaxSeeleSpd.value  > 200) { inputMaxSeeleSpd.value = 200; }
        if (inputMaxHanabiSpd.value <= inputMinHanabiSpd.value) {inputMaxHanabiSpd.value = parseInt(inputMinHanabiSpd.value) + 1; }
        if (inputMaxSeeleSpd.value <= inputMinSeeleSpd.value) {inputMaxSeeleSpd.value = parseInt(inputMinSeeleSpd.value) + 1; }
    }

    function runSimulations() {
        let seeleSpdSimulation = inputMinSeeleSpd.value;
        let hanabiSpdSimulation = inputMinHanabiSpd.value;
        while (seeleSpdSimulation <= inputMaxSeeleSpd.value) {
            while (hanabiSpdSimulation <= inputMaxHanabiSpd.value) {
                calculate(seeleSpdSimulation, hanabiSpdSimulation, inputFuSpd.value, inputSwSpd.value, inputCycles.value,
                    119, 'Fu Xuan', 'Silver Wolf', 5);
                hanabiSpdSimulation++;
            }
            seeleSpdSimulation++;
            hanabiSpdSimulation = inputMinHanabiSpd.value;
        }
    }

    window.addEventListener("load", start, false);
}