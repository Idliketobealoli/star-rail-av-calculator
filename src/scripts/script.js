import {
    calculate,
    trueFalseButton,
    setFooterWidth,
    showResults,
    sortResultsBySeeleTurns,
    resetResults
} from "./common.js";
import {harmonyUnits, implementedCones, implementedSets, implementedSupports} from "../characters/Character.js";

{
    let button, main, footer;
    let selectSparkleSet, selectPrioSupSet, selectSupSet;
    let sparkleConeSelect, prioSupConeSelect, supConeSelect;
    let inputSeeleSpd, inputSparkleSpd, inputPrioSupSpd, inputSupSpd;
    let inputCycles, inputInitialEnergy, sparkleEr, prioSupEr, supEr;
    let e2seele, sparkleVonwacq, prioSupVonwacq, supVonwacq, turnOrder;
    let prioSupSelect, supSelect, prioSupImg, supImg;

    function start() {
        button = document.getElementById("calculate");
        inputSeeleSpd = document.getElementById("seeleSpd");
        inputSparkleSpd = document.getElementById("hanabiSpd");
        inputPrioSupSpd = document.getElementById("fuSpd");
        inputSupSpd = document.getElementById("swSpd");
        inputCycles = document.getElementById("cycles");
        inputInitialEnergy = document.getElementById("initialEnergyPerc");
        sparkleEr = document.getElementById("sparkleEr");
        prioSupEr = document.getElementById("prioSupEr");
        supEr = document.getElementById("supEr");
        e2seele = document.getElementById("e2Seele");
        sparkleVonwacq = document.getElementById("sparkleVonwacq");
        sparkleConeSelect = document.getElementById("sparkleCone");
        prioSupConeSelect = document.getElementById("prioSupCone");
        supConeSelect = document.getElementById("supCone");
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

        let prioSupCone = -1;
        if (prioSupConeSelect !== null) {
            prioSupCone = prioSupConeSelect.selectedOptions[0].value;
        }
        let supCone = -1;
        if (supConeSelect !== null) {
            supCone = supConeSelect.selectedOptions[0].value;
        }
        calculate(
            inputSeeleSpd.value, inputSparkleSpd.value, inputPrioSupSpd.value,
            inputSupSpd.value, inputCycles.value, sparkleEr.value, prioSupEr.value,
            supEr.value, sparkleConeSelect.selectedOptions[0].value,
            prioSupCone, supCone, prioSupSelect.selectedOptions[0].value,
            supSelect.selectedOptions[0].value, inputInitialEnergy.value,
            selectSparkleSet.selectedIndex, selectPrioSupSet.selectedIndex,
            selectSupSet.selectedIndex);

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

        if (inputInitialEnergy.value === "") {
            inputInitialEnergy.parentNode.setAttribute("class", "input-group red-border");
            correct = false; }
        else { inputInitialEnergy.parentNode.setAttribute("class", "input-group"); }

        if (sparkleEr.value === "") { sparkleEr.value = 100; }
        if (prioSupEr.value === "") { prioSupEr.value = 100; }
        if (supEr.value     === "") { supEr.value     = 100; }

        return correct;
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
        let span = document.getElementById(`${support}Span`);
        let lightconeSelect = document.getElementById(`${support}Cone`);
        if (span !== null) { span.remove(); }
        if (lightconeSelect !== null) { lightconeSelect.remove(); }
        if (harmonyUnits.includes(name)) {
            span = document.createElement("span");
            span.setAttribute("id", `${support}Span`);
            span.textContent = "Equipped cone:";
            lightconeSelect = document.createElement("select");
            lightconeSelect.setAttribute("id", `${support}Cone`);
            lightconeSelect.setAttribute("name", "cone");
            lightconeSelect.setAttribute("required", "");

            let p = document.getElementById(`${support}P`);
            p.appendChild(span);
            p.appendChild(lightconeSelect);
            addConeOptions(support);
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