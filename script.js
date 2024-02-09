{
    let button;
    let inputSeeleSpd;
    let inputHanabiSpd;
    let inputFuSpd;
    let inputSwSpd;
    let inputCycles;
    let e2seele;
    let main;
    let footer;

    function start() {
        button = document.getElementById("calculate");
        inputSeeleSpd = document.getElementById("seeleSpd");
        inputHanabiSpd = document.getElementById("hanabiSpd");
        inputFuSpd = document.getElementById("fuSpd");
        inputSwSpd = document.getElementById("swSpd");
        inputCycles = document.getElementById("cycles");
        e2seele = document.getElementById("e2Seele");
        main = document.getElementById("main");
        footer = document.getElementById("footer");

        e2seele.addEventListener("click", changeE2seele);
        button.addEventListener("click", simulate);
    }

    function simulate() {
        if (inputSeeleSpd.value  === "" ||
            inputHanabiSpd.value === "" ||
            inputFuSpd.value     === "" ||
            inputSwSpd.value     === "" ||
            inputCycles.value    === ""  ) { return; }

        window.results = [];
        calculate(inputSeeleSpd.value, inputHanabiSpd.value, inputFuSpd.value, inputSwSpd.value, inputCycles.value);

        window.results = results.sort((a, b) => a.seeleTurns - b.seeleTurns);
        showResults(window.results, main);
        setFooterWidth(main, footer);
    }

    window.addEventListener("load", start, false);
}