import {
    calculate,
    trueFalseButton,
    filterResults,
    resetResults,
    setFooterWidth,
    showResults,
    spliceResults
} from "./common.js";
import {harmonyUnits, implementedCones, implementedSets, implementedSupports} from "../characters/Character.js";

{
    let button, main, footer;
    let selectSparkleSet, sparkleConeSelect, prioSupConeSelect,
        supConeSelect, selectPrioSupSet, selectSupSet;
    let prioSupEidolonSelect, supEidolonSelect;
    let inputSupSpd, inputPrioSupSpd, inputMaxSeeleSpd,
        inputMinSeeleSpd, inputMinSparkleSpd,
        inputMaxSparkleSpd, inputInitialEnergy,
        sparkleEr, prioSupEr, supEr;
    let filterCriteria, inputResultsAmount, inputCycles;
    let e2seele, e4sparkle, sparkleVonwacq, prioSupVonwacq, supVonwacq, turnOrder;
    let prioSupSelect, supSelect, prioSupImg, supImg;

    function start() {
        button = document.getElementById("calculate");
        inputMinSeeleSpd = document.getElementById("seeleMinSpd");
        inputMaxSeeleSpd = document.getElementById("seeleMaxSpd");
        inputMinSparkleSpd = document.getElementById("hanabiMinSpd");
        inputMaxSparkleSpd = document.getElementById("hanabiMaxSpd");
        inputPrioSupSpd = document.getElementById("fuSpd");
        inputSupSpd = document.getElementById("swSpd");
        inputCycles = document.getElementById("cycles");
        inputInitialEnergy = document.getElementById("initialEnergyPerc");
        sparkleEr = document.getElementById("sparkleEr");
        prioSupEr = document.getElementById("prioSupEr");
        supEr = document.getElementById("supEr");
        filterCriteria = document.getElementById("criteria");
        inputResultsAmount = document.getElementById("resultsAmount");
        e2seele = document.getElementById("e2Seele");
        e4sparkle = document.getElementById("e4Sparkle");
        sparkleVonwacq = document.getElementById("sparkleVonwacq");
        sparkleConeSelect = document.getElementById("sparkleCone");
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
        e4sparkle.addEventListener("click", trueFalseButton);
        sparkleVonwacq.addEventListener("click", trueFalseButton);
        prioSupVonwacq.addEventListener("click", trueFalseButton);
        supVonwacq.addEventListener("click", trueFalseButton);
        turnOrder.addEventListener("click", trueFalseButton);

        button.addEventListener("click", simulate);
    }

    function simulate() {
        if (!validateSimulation()) { return; }
        resetResults();
        runSimulations();
        filterResults(filterCriteria.value);

        if (inputResultsAmount.value  === "" || inputResultsAmount.value < 1) { inputResultsAmount.value = 10; }
        if (inputResultsAmount.value  > 25) { inputResultsAmount.value = 25; }
        spliceResults(inputResultsAmount.value);

        showResults(main);
        setFooterWidth(main, footer);
    }

    function validateSimulation() {
        let correct = true;

        if (inputPrioSupSpd.value === "") {
            inputPrioSupSpd.parentNode.setAttribute("class", "input-group red-border");
            correct = false; }
        else { inputPrioSupSpd.parentNode.setAttribute("class", "input-group"); }
        if (inputSupSpd.value === "") {
            inputSupSpd.parentNode.setAttribute("class", "input-group red-border");
            correct = false; }
        else { inputSupSpd.parentNode.setAttribute("class", "input-group"); }
        if (inputCycles.value === "") {
            inputCycles.parentNode.setAttribute("class", "input-group red-border");
            correct = false; }
        else { inputCycles.parentNode.setAttribute("class", "input-group"); }
        if (inputInitialEnergy.value === "") {
            inputInitialEnergy.parentNode.setAttribute("class", "input-group red-border");
            correct = false; }
        else { inputInitialEnergy.parentNode.setAttribute("class", "input-group"); }

        if (inputMinSparkleSpd.value === "" || inputMinSparkleSpd.value < 101) { inputMinSparkleSpd.value = 101; }
        if (inputMaxSparkleSpd.value === "" || inputMaxSparkleSpd.value > 200) { inputMaxSparkleSpd.value = 200; }
        if (inputMinSeeleSpd.value   === "" || inputMinSeeleSpd.value   < 115) { inputMinSeeleSpd.value   = 115; }
        if (inputMaxSeeleSpd.value   === "" || inputMaxSeeleSpd.value   > 200) { inputMaxSeeleSpd.value   = 200; }
        if (inputMaxSparkleSpd.value <= inputMinSparkleSpd.value) { inputMaxSparkleSpd.value = parseFloat(inputMinSparkleSpd.value); }
        if (inputMaxSeeleSpd.value   <=   inputMinSeeleSpd.value) { inputMaxSeeleSpd.value   = parseFloat(inputMinSeeleSpd.value);   }

        if (sparkleEr.value === "") { sparkleEr.value = 100; }
        if (prioSupEr.value === "") { prioSupEr.value = 100; }
        if (supEr.value     === "") { supEr.value     = 100; }

        return correct;
    }

    function runSimulations() {
        let seeleSpdSimulation = inputMinSeeleSpd.value;
        let hanabiSpdSimulation = inputMinSparkleSpd.value;

        prioSupConeSelect = document.getElementById("prioSupCone");
        supConeSelect = document.getElementById("supCone");
        prioSupEidolonSelect = document.getElementById("prioSupEidolon");
        supEidolonSelect = document.getElementById("supEidolon");

        let prioSupCone = -1;
        if (prioSupConeSelect !== null) { prioSupCone = prioSupConeSelect.selectedOptions[0].value; }
        let supCone = -1;
        if (supConeSelect !== null) { supCone = supConeSelect.selectedOptions[0].value; }
        let prioSupEidolon = -1;
        if (prioSupEidolonSelect !== null) { prioSupEidolon = prioSupEidolonSelect.selectedOptions[0].value; }
        let supEidolon = -1;
        if (supEidolonSelect !== null) { supEidolon = supEidolonSelect.selectedOptions[0].value; }

        while (seeleSpdSimulation <= inputMaxSeeleSpd.value) {
            while (hanabiSpdSimulation <= inputMaxSparkleSpd.value) {
                calculate(
                    seeleSpdSimulation, hanabiSpdSimulation, inputPrioSupSpd.value,
                    inputSupSpd.value, inputCycles.value, sparkleEr.value, prioSupEr.value,
                    supEr.value, sparkleConeSelect.selectedOptions[0].value,
                    prioSupCone, supCone, prioSupEidolon, supEidolon,
                    prioSupSelect.selectedOptions[0].value, supSelect.selectedOptions[0].value,
                    inputInitialEnergy.value, selectSparkleSet.selectedIndex,
                    selectPrioSupSet.selectedIndex, selectSupSet.selectedIndex);
                hanabiSpdSimulation++;
            }
            seeleSpdSimulation++;
            hanabiSpdSimulation = inputMinSparkleSpd.value;
        }
    }

    function addSelects() {
        addConeOptions(null);
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
                addCustomOptions("prioSup", e.target.selectedOptions[0].value);
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
                addCustomOptions("sup", e.target.selectedOptions[0].value);
                break;
            }
        }
    }

    function addCustomOptions(support, name) {
        let spanCone = document.getElementById(`${support}SpanCone`);
        let lightconeSelect = document.getElementById(`${support}Cone`);
        if (spanCone !== null) { spanCone.remove(); }
        if (lightconeSelect !== null) { lightconeSelect.remove(); }
        if (harmonyUnits.includes(name)) {
            spanCone = document.createElement("span");
            spanCone.setAttribute("id", `${support}SpanCone`);
            spanCone.textContent = "Equipped cone: ";
            lightconeSelect = document.createElement("select");
            lightconeSelect.setAttribute("id", `${support}Cone`);
            lightconeSelect.setAttribute("name", "cone");
            lightconeSelect.setAttribute("required", "");

            let p = document.getElementById(`${support}P`);
            p.appendChild(spanCone);
            p.appendChild(lightconeSelect);
            addConeOptions(support);
        }
        customEidolons(support, name);
    }

    function customEidolons(support, name) {
        let spanEidolon = document.getElementById(`${support}SpanEidolon`);
        let eidolonSelect = document.getElementById(`${support}Eidolon`);
        let removableBrs = document.getElementsByName(`removableBr`);
        if (spanEidolon !== null) { spanEidolon.remove(); }
        if (eidolonSelect !== null) { eidolonSelect.remove(); }
        for (let removableBr of Array.from(removableBrs)) {
            removableBr.remove();
        }

        if (implementedSupports.includes(name) && name !== "Other") {
            let removableBr = document.createElement("br");
            removableBr.setAttribute("name", "removableBr");
            spanEidolon = document.createElement("span");
            spanEidolon.setAttribute("id", `${support}SpanEidolon`);
            spanEidolon.textContent = "Select relevant eidolon: ";
            eidolonSelect = document.createElement("select");
            eidolonSelect.setAttribute("id", `${support}Eidolon`);
            eidolonSelect.setAttribute("name", "eidolon");
            eidolonSelect.setAttribute("required", "");

            let p = document.getElementById(`${support}P`);
            switch (name) {
                case "Bronya": {
                    let e0 = document.createElement("option");
                    e0.setAttribute("value", "0");
                    e0.textContent = "E0";
                    let e1 = document.createElement("option");
                    e1.setAttribute("value", "1");
                    e1.textContent = "E1";
                    let e2 = document.createElement("option");
                    e2.setAttribute("value", "2");
                    e2.textContent = "E2";

                    eidolonSelect.append(e0, e1, e2);
                    p.append(
                        removableBr.cloneNode(true),
                        removableBr.cloneNode(true),
                        spanEidolon, eidolonSelect
                    );
                    break;
                }

                // TODO: IMPLEMENT MORE CHARACTERS.
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
            case "Bronya": {
                imgUrl = "img/Bronya.png";
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

    function addConeOptions(support) {
        let coneSelects = document.getElementsByName("cone");
        if (support !== null) {
            coneSelects = Array.from(coneSelects)
                .filter(coneSelect => coneSelect.id === `${support}Cone`);
        }

        for (let coneSelect of coneSelects) {
            coneSelect.innerHTML = '';
        }

        for (let implementedCone of implementedCones) {
            let element = document.createElement("option");
            element.setAttribute("value", `${implementedCone.value}`);
            element.textContent = implementedCone.message;

            for (let coneSelect of coneSelects) {
                coneSelect.appendChild(element.cloneNode(true));
            }
        }
    }

    window.addEventListener("load", start, false);
}