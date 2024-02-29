import {
    calculate,
    trueFalseButton,
    setFooterWidth,
    showResults,
    sortResultsBySeeleTurns,
    resetResults
} from "./common.js";
import {implementedSets, implementedSupports} from "../characters/Character.js";

{
    let button, main, footer;
    let selectSparkleSet, sparkleDddSelect, selectPrioSupSet, selectSupSet;
    let inputSeeleSpd, inputSparkleSpd, inputPrioSupSpd, inputSupSpd;
    let inputCycles;
    let e2seele, sparkleVonwacq, prioSupVonwacq, supVonwacq, turnOrder;
    let prioSupSelect, supSelect, prioSupImg, supImg;

    function start() {
        button = document.getElementById("calculate");
        inputSeeleSpd = document.getElementById("seeleSpd");
        inputSparkleSpd = document.getElementById("hanabiSpd");
        inputPrioSupSpd = document.getElementById("fuSpd");
        inputSupSpd = document.getElementById("swSpd");
        inputCycles = document.getElementById("cycles");
        e2seele = document.getElementById("e2Seele");
        sparkleVonwacq = document.getElementById("sparkleVonwacq");
        sparkleDddSelect = document.getElementById("sparkleDdd");
        prioSupVonwacq = document.getElementById("prioSupVonwacq");
        supVonwacq = document.getElementById("supVonwacq");
        turnOrder = document.getElementById("turnOrder");
        selectSparkleSet = document.getElementById("sparkleSet");
        selectPrioSupSet = document.getElementById("prioSupSet");
        selectSupSet = document.getElementById("supSet");
        prioSupSelect = document.getElementById("prioSup");
        supSelect = document.getElementById("sup");
        prioSupImg = document.getElementById("prioSupImg");
        supImg = document.getElementById("supImg");
        main = document.getElementById("main");
        footer = document.getElementById("footer");

        addSelects();

        e2seele.addEventListener("click", trueFalseButton);
        sparkleVonwacq.addEventListener("click", trueFalseButton);
        prioSupVonwacq.addEventListener("click", trueFalseButton);
        supVonwacq.addEventListener("click", trueFalseButton);
        turnOrder.addEventListener("click", trueFalseButton);

        button.addEventListener("click", simulate);
    }

    function simulate() {
        if (!validateForm()) { return; }
        resetResults();

        calculate(inputSeeleSpd.value, inputSparkleSpd.value, inputPrioSupSpd.value,
            inputSupSpd.value, inputCycles.value, 119, sparkleDddSelect.selectedOptions[0].value,
            prioSupSelect.selectedOptions[0].value, supSelect.selectedOptions[0].value, 5,
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
        addDddOptions();
        for (let implementedSet of implementedSets) {
            let element = document.createElement("option");
            element.setAttribute("value", implementedSet.value);
            element.textContent = implementedSet.message;
            selectSparkleSet.appendChild(element.cloneNode(true));
            selectPrioSupSet.appendChild(element.cloneNode(true));
            selectSupSet.appendChild(element.cloneNode(true));
        }

        for (let implementedSupport of implementedSupports) {
            let element = document.createElement("option");
            element.setAttribute("value", implementedSupport);
            element.setAttribute("name", `${implementedSupport}_option`);
            element.textContent = implementedSupport;
            prioSupSelect.appendChild(element.cloneNode(true));
            supSelect.appendChild(element.cloneNode(true));
        }
        prioSupSelect.childNodes[0].setAttribute("selected", "");
        prioSupSelect.childNodes[1].setAttribute("disabled", "");
        supSelect.childNodes[1].setAttribute("selected", "");
        supSelect.childNodes[0].setAttribute("disabled", "");

        prioSupSelect.addEventListener("change", disableOptions);
        supSelect.addEventListener("change", disableOptions);
    }

    function disableOptions(e) {
        switch(e.target.id) {
            case prioSupSelect.id: {
                for (let childNode of supSelect.childNodes) {
                    childNode.removeAttribute("disabled");
                    if (childNode.index === e.target.selectedIndex &&
                        e.target.selectedOptions[0].value !== "Other") {
                        childNode.setAttribute("disabled", "");
                    }
                }
                updateImage("prioSup", e.target.selectedOptions[0].value);
                break;
            }
            case supSelect.id: {
                for (let childNode of prioSupSelect.childNodes) {
                    childNode.removeAttribute("disabled");
                    if (childNode.index === e.target.selectedIndex &&
                        e.target.selectedOptions[0].value !== "Other") {
                        childNode.setAttribute("disabled", "");
                    }
                }
                updateImage("sup", e.target.selectedOptions[0].value);
                break;
            }
        }
    }

    function updateImage(support, name) {
        let imgUrl;
        switch(name) {
            case "Fu Xuan": {
                imgUrl = "img/FuXuan.png";
                break;
            }
            case "Silver Wolf": {
                imgUrl = "img/SilverWolf.png";
                break;
            }
            default: {
                if (support === "prioSup") {
                    imgUrl = "img/golden_trash.png";
                }
                else { imgUrl = "img/trash.png"; }
            }
        }
        if (support === "prioSup") {
            prioSupImg.removeAttribute("src");
            prioSupImg.setAttribute("src", imgUrl);
        }
        else {
            supImg.removeAttribute("src");
            supImg.setAttribute("src", imgUrl);
        }
    }

    function addDddOptions() {
        let dddSelects = document.getElementsByName("ddd");

        let dddNotEquipped = document.createElement("option");
        dddNotEquipped.setAttribute("value", "-1");
        dddNotEquipped.textContent = "No";
        for (let dddSelect of dddSelects) {
            dddSelect.appendChild(dddNotEquipped.cloneNode(true));
        }

        for (let i = 1; i <= 5; i++) {
            let element = document.createElement("option");
            element.setAttribute("value", `${i}`);
            element.textContent = "S"+i;

            for (let dddSelect of dddSelects) {
                dddSelect.appendChild(element.cloneNode(true));
            }
        }
    }

    window.addEventListener("load", start, false);
}