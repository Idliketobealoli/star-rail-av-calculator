import {
    calculate,
    changeE2seele,
    setFooterWidth,
    showResults,
    sortResultsBySeeleTurns,
    resetResults, wearsVonwacq
} from "./common.js";
import {implementedSets} from "../characters/Character.js";

{
    let button, main, footer;
    let selectSparkleSet, selectPrioSupSet, selectSupSet;
    let inputSeeleSpd, inputSparkleSpd, inputPrioSupSpd, inputSupSpd;
    let inputCycles;
    let e2seele, sparkleVonwacq, prioSupVonwacq, supVonwacq;

    function start() {
        button = document.getElementById("calculate");
        inputSeeleSpd = document.getElementById("seeleSpd");
        inputSparkleSpd = document.getElementById("hanabiSpd");
        inputPrioSupSpd = document.getElementById("fuSpd");
        inputSupSpd = document.getElementById("swSpd");
        inputCycles = document.getElementById("cycles");
        e2seele = document.getElementById("e2Seele");
        sparkleVonwacq = document.getElementById("sparkleVonwacq");
        prioSupVonwacq = document.getElementById("prioSupVonwacq");
        supVonwacq = document.getElementById("supVonwacq");
        main = document.getElementById("main");
        footer = document.getElementById("footer");
        selectSparkleSet = document.getElementById("sparkleSet");
        selectPrioSupSet = document.getElementById("prioSupSet");
        selectSupSet = document.getElementById("supSet");

        addSelects();

        e2seele.addEventListener("click", changeE2seele);
        sparkleVonwacq.addEventListener("click", wearsVonwacq);
        prioSupVonwacq.addEventListener("click", wearsVonwacq);
        supVonwacq.addEventListener("click", wearsVonwacq);

        button.addEventListener("click", simulate);
    }

    function simulate() {
        if (!validateForm()) { return; }
        resetResults();

        calculate(inputSeeleSpd.value, inputSparkleSpd.value, inputPrioSupSpd.value, inputSupSpd.value, inputCycles.value,
            119, 'Fu Xuan', 'Silver Wolf', 5,
            selectSparkleSet.selectedIndex, selectPrioSupSet.selectedIndex, selectSupSet.selectedIndex);

        sortResultsBySeeleTurns();
        showResults(main);
        setFooterWidth(main, footer);
    }

    function validateForm() {
        let correct = true;

        if (inputSeeleSpd.value   === "") {
            inputSeeleSpd.parentNode.setAttribute("class", "input-group red-border");
            correct = false; }
        else { inputSeeleSpd.parentNode.setAttribute("class", "input-group"); }

        if (inputSparkleSpd.value === "") {
            inputSparkleSpd.parentNode.setAttribute("class", "input-group red-border");
            correct = false; }
        else { inputSparkleSpd.parentNode.setAttribute("class", "input-group"); }

        if (inputPrioSupSpd.value === "") {
            inputPrioSupSpd.parentNode.setAttribute("class", "input-group red-border");
            correct = false; }
        else { inputPrioSupSpd.parentNode.setAttribute("class", "input-group"); }

        if (inputSupSpd.value     === "") {
            inputSupSpd.parentNode.setAttribute("class", "input-group red-border");
            correct = false; }
        else { inputSupSpd.parentNode.setAttribute("class", "input-group"); }

        if (inputCycles.value     === "") {
            inputCycles.parentNode.setAttribute("class", "input-group red-border");
            correct = false; }
        else { inputCycles.parentNode.setAttribute("class", "input-group"); }

        return correct;
    }

    function addSelects() {
        for (let implementedSet of implementedSets) {
            let element = document.createElement("option");
            element.setAttribute("value", implementedSet.value);
            element.textContent = implementedSet.message;
            selectSparkleSet.appendChild(element.cloneNode(true));
            selectPrioSupSet.appendChild(element.cloneNode(true));
            selectSupSet.appendChild(element.cloneNode(true));
        }
    }

    window.addEventListener("load", start, false);
}