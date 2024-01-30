{
    let button;
    let resultsParagraph;
    let inputSeeleSpd;
    let inputHanabiSpd;
    let inputFuSpd;
    let inputSwSpd;
    let inputCycles;
    let sectionResults;
    let h1Results;
    let e2seele;

    function start() {
        button = document.getElementById("calculate");
        resultsParagraph = document.getElementById("results");
        inputSeeleSpd = document.getElementById("seeleSpd");
        inputHanabiSpd = document.getElementById("hanabiSpd");
        inputFuSpd = document.getElementById("fuSpd");
        inputSwSpd = document.getElementById("swSpd");
        inputCycles = document.getElementById("cycles");
        sectionResults = document.getElementById("resultSection");
        h1Results = document.getElementById("h1Results");
        e2seele = document.getElementById("e2Seele");

        e2seele.addEventListener("click", changeE2seele);
        button.addEventListener("click", simulate);
    }

    function simulate() {
        resultsParagraph.innerHTML = "";
        if (inputSeeleSpd.value  === "" ||
            inputHanabiSpd.value === "" ||
            inputFuSpd.value     === "" ||
            inputSwSpd.value     === "" ||
            inputCycles.value    === ""  ) { return; }

        window.results = [];
        calculate(inputSeeleSpd.value, inputHanabiSpd.value, inputFuSpd.value, inputSwSpd.value, inputCycles.value);

        window.results = results.sort((a, b) => a.seeleTurns - b.seeleTurns);
        for (let i = 0; i < results.length; i++) {
            resultsParagraph.innerHTML += results[i].message;
        }

        sectionResults.removeAttribute("class");
        h1Results.removeAttribute("class");
    }

    window.addEventListener("load", start, false);
}