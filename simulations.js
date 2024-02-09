{
    let button, inputFuSpd, main, footer,
        inputSwSpd, inputCycles, inputMaxSeeleSpd,
        inputMinSeeleSpd, inputMinHanabiSpd,
        inputMaxHanabiSpd, inputExpectedBuffs,
        filterCriteria, inputResultsAmount, e2seele;

    function start() {
        button = document.getElementById("calculate");
        inputMinSeeleSpd = document.getElementById("seeleMinSpd");
        inputMaxSeeleSpd = document.getElementById("seeleSpd");
        inputMinHanabiSpd = document.getElementById("hanabiMinSpd");
        inputMaxHanabiSpd = document.getElementById("hanabiSpd");
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
        validateSimulation();
        runSimulations();
        filterResults();

        if (inputResultsAmount.value  === "" || inputResultsAmount.value < 1) { inputResultsAmount.value = 10; }
        if (inputResultsAmount.value  > 50) { inputResultsAmount.value = 50; }
        window.results.splice(inputResultsAmount.value);

        showResults(window.results, main);
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
        window.results = [];
        let seeleSpdSimulation = inputMinSeeleSpd.value;
        let hanabiSpdSimulation = inputMinHanabiSpd.value;
        while (seeleSpdSimulation <= inputMaxSeeleSpd.value) {
            while (hanabiSpdSimulation <= inputMaxHanabiSpd.value) {
                calculate(seeleSpdSimulation, hanabiSpdSimulation, inputFuSpd.value, inputSwSpd.value, inputCycles.value);
                hanabiSpdSimulation++;
            }
            seeleSpdSimulation++;
            hanabiSpdSimulation = inputMinHanabiSpd.value;
        }
    }

    function filterResults() {
        let maxBuffedTurns;
        if (inputExpectedBuffs.value === "") {
            maxBuffedTurns = window.results.reduce((maxResult, currentResult) => {
                return currentResult.buffedTurns > maxResult.buffedTurns ? currentResult : maxResult;
            }, window.results[0]).buffedTurns - 2;
        }
        else { maxBuffedTurns = inputExpectedBuffs.value; }
        window.results = results.filter(result => result.buffedTurns >= maxBuffedTurns);

        if (filterCriteria.value === "2") {
            window.results = results.sort((a, b) => {
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
            window.results = results.sort((a, b) => {
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

    window.addEventListener("load", start, false);
}