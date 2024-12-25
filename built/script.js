var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const keyboard = document.querySelectorAll("#keyboard button");
const keyboardText = [];
const allWordEls = document.querySelectorAll(".lines .line .letter");
const display = document.querySelector("#win-display");
let wordElsArr = [];
let guessedWords = [];
let allowInput = true;
let line = 0;
let cursor = 0;
let todaysWord = "MOPED";
function onReady() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let button of keyboard) {
            button.addEventListener("click", function () {
                processInput(this);
            });
        }
        todaysWord = yield getNewWord();
        display.querySelector("button").addEventListener("click", function () {
            reset();
        });
        const linesEl = document.querySelector(".lines");
        let word;
        for (let i = 0; i < allWordEls.length; i += 5) {
            word = [];
            // let lineEl = document.createElement("div");
            // lineEl.classList.add("line");
            // linesEl.appendChild(lineEl);
            for (let j = 0; j < 5; j++) {
                word.push(allWordEls[i + j]);
                // lineEl.appendChild(allWordEls[i + j]);
            }
            wordElsArr.push(word);
        }
        for (let button of keyboard) {
            keyboardText.push(button.innerHTML);
        }
    });
}
window.onload = onReady;
window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return;
    }
    let input = "";
    if (event.key.length == 1 && event.key.match(/[a-z]/i)) {
        input = event.key.toUpperCase();
    }
    else if (event.key == "Enter" || event.key == "Backspace") {
        input = event.key;
    }
    else {
        return;
    }
    gameLoop(input);
    event.preventDefault();
}, true);
const checkWord = (word) => __awaiter(this, void 0, void 0, function* () {
    if (word == todaysWord) {
        return true;
    }
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    try {
        const response = yield fetch(url);
        return response.ok;
    }
    catch (error) {
        return false;
    }
});
function getNewWord() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://random-word-api.herokuapp.com/word?length=5");
        const data = yield response.json();
        return data[0].toUpperCase();
    });
}
function getStrWords() {
    let words = [];
    let strWord = "";
    for (let wordEls of wordElsArr) {
        strWord = "";
        for (let letter of wordEls) {
            strWord += letter.innerHTML;
        }
        words.push(strWord);
    }
    return words;
}
function getCurrentWord() {
    return getStrWords()[line];
}
function reset() {
    return __awaiter(this, void 0, void 0, function* () {
        line = 0;
        cursor = 0;
        for (let letter of allWordEls) {
            letter.classList.remove("guessed");
            letter.innerHTML = "";
            letter.style.background = "none";
        }
        for (let button of keyboard) {
            button.classList.remove("guessed");
            button.style.background = getCSScolor("button");
        }
        allowInput = true;
        display.style.display = "none";
        todaysWord = yield getNewWord();
    });
}
function getCSScolor(varName) {
    return getComputedStyle(document.body).getPropertyValue("--" + varName + "-color");
}
function getButtonIndexes() {
    let indexes = [];
    let currentWord = getCurrentWord();
    for (let letter of currentWord) {
        let index = keyboardText.indexOf(letter);
        if (index > -1) {
            indexes.push(index);
        }
    }
    return indexes;
}
function instancesBefore(word, index) {
    let count = 0;
    for (let i = 0; i < index; i++) {
        if (word[i] == word[index]) {
            count++;
        }
    }
    return count;
}
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function checkWin() {
    return __awaiter(this, void 0, void 0, function* () {
        let currentWord = getCurrentWord();
        let lineColors = [];
        for (let i = 0; i < 5; i++) {
            if (currentWord[i] == todaysWord[i]) {
                lineColors.push("correct-spot");
            }
            else if (todaysWord.includes(currentWord[i])) {
                lineColors.push("wrong-spot");
            }
            else {
                lineColors.push("locked");
            }
        }
        let count = 0;
        let currentInstance = 0;
        const currentLine = wordElsArr[line];
        for (let i = 0; i < 5; i++) {
            count = 0;
            currentInstance = 0;
            if (lineColors[i] == "wrong-spot") {
                for (let j = 0; j < 5; j++) {
                    if (currentWord[i] == todaysWord[j]) {
                        count++;
                    }
                }
                for (let j = 0; j < 5; j++) {
                    if (currentWord[i] == currentWord[j]) {
                        if (lineColors[j] == "correct-spot" ||
                            lineColors[j] == "wrong-spot") {
                            currentInstance++;
                        }
                        if (currentInstance > count) {
                            lineColors[i] = "locked";
                        }
                    }
                }
                if (instancesBefore(currentWord, i) >= count) {
                    lineColors[i] == "locked";
                }
            }
            currentLine[i].style.background = getCSScolor(lineColors[i]);
            animate(currentLine[i], "rotate");
            currentLine[i].classList.add("guessed");
            currentLine[i].classList.remove("entered");
            yield wait(350);
        }
        let indexes = getButtonIndexes();
        for (let i = 0; i < 5; i++) {
            let buttonColor = keyboard[indexes[i]].style.backgroundColor;
            if (buttonColor == getCSScolor("correct-spot")) {
                continue;
            }
            else if (buttonColor == getCSScolor("wrong-spot")) {
                if (lineColors[i] != "correct-spot") {
                    continue;
                }
            }
            keyboard[indexes[i]].style.background = getCSScolor(lineColors[i]);
            keyboard[indexes[i]].classList.add("guessed");
        }
        let correctCount = 0;
        for (let color of lineColors) {
            if (color == "correct-spot") {
                correctCount++;
            }
        }
        if (correctCount == 5) {
            return true;
        }
        return false;
    });
}
function processInput(button) {
    let input = "";
    switch (button.id) {
        case "enter":
            input = "Enter";
            break;
        case "delete":
            input = "Backspace";
            break;
        default:
            input = button.innerHTML;
    }
    gameLoop(input);
}
function showMessage(message) {
    allowInput = false;
    display.style.display = "flex";
    display.querySelector("h1").innerHTML = message;
    display.querySelector("h2").innerHTML = todaysWord;
}
function animate(el, animation) {
    el.classList.remove(animation);
    void el.offsetWidth;
    el.classList.add(animation);
}
function gameLoop(input) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!allowInput) {
            return;
        }
        let currentWord = getCurrentWord();
        switch (input) {
            case "Enter":
                if (!(currentWord.length == 5) || !(yield checkWord(currentWord))) {
                    let currentLineEl = wordElsArr[line][0].parentElement;
                    animate(currentLineEl, "shake");
                }
                else {
                    if (yield checkWin()) {
                        showMessage("You guessed the word!");
                    }
                    cursor = 0;
                    line++;
                    guessedWords.push(currentWord);
                    if (line > 5) {
                        showMessage("You didn't guess it!");
                    }
                }
                break;
            case "Backspace":
                if (cursor > 0) {
                    cursor--;
                }
                wordElsArr[line][cursor].classList.remove("entered");
                wordElsArr[line][cursor].innerHTML = "";
                break;
            default:
                if (cursor < 5 && wordElsArr[line][cursor].innerHTML.length == 0) {
                    wordElsArr[line][cursor].innerHTML = input;
                    wordElsArr[line][cursor].classList.add("entered");
                    animate(wordElsArr[line][cursor], "bounce");
                    cursor++;
                }
        }
    });
}
