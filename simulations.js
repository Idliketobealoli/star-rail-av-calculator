{
    let button, resultsParagraph, inputFuSpd,
        inputSwSpd, inputCycles, inputMaxSeeleSpd,
        inputMinSeeleSpd, inputMinHanabiSpd,
        inputMaxHanabiSpd, inputExpectedBuffs,
        filterCriteria, inputResultsAmount,
        sectionResults, h1Results, e2seele;

    function start() {
        button = document.getElementById("calculate");
        resultsParagraph = document.getElementById("results");
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
        sectionResults = document.getElementById("resultSection");
        h1Results = document.getElementById("h1Results");
        e2seele = document.getElementById("e2Seele");

        e2seele.addEventListener("click", changeE2seele);
        button.addEventListener("click", simulate);
    }

    function simulate() {
        resultsParagraph.innerHTML = "";
        if (inputFuSpd.value        === "" ||
            inputSwSpd.value        === "" ||
            inputCycles.value       === "") { return; }
        if (inputMinHanabiSpd.value === "") { inputMinHanabiSpd.value = 101; }
        if (inputMaxHanabiSpd.value === "") { inputMaxHanabiSpd.value = 171; }
        if (inputMinSeeleSpd.value  === "") { inputMinSeeleSpd.value = 115; }
        if (inputMaxSeeleSpd.value  === "") { inputMaxSeeleSpd.value = 173; }
        if (inputMaxHanabiSpd.value < inputMinHanabiSpd.value) {inputMaxHanabiSpd.value = inputMinHanabiSpd.value + 1; }
        if (inputMaxSeeleSpd.value < inputMinSeeleSpd.value) {inputMaxSeeleSpd.value = inputMinSeeleSpd.value + 1; }

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

        if (inputResultsAmount.value  === "") { inputResultsAmount.value = 10; }
        if (inputResultsAmount.value  > 50) { inputResultsAmount.value = 50; }
        window.results.splice(inputResultsAmount.value);
        for (let i = 0; i < results.length; i++) {
            resultsParagraph.innerHTML += results[i].message;
        }

        sectionResults.removeAttribute("class");
        h1Results.removeAttribute("class");
    }

    window.addEventListener("load", start, false);
}