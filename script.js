const keyboard = document.querySelectorAll("#keyboard button");
const keyboardText = [];
const allWordEls = document.querySelectorAll(".lines .letter");
const display = document.querySelector("#win-display");
let wordElsArr = [];

let allowInput = true;
let line = 0;
let cursor = 0;

let todaysWord = "MOPED";

async function onReady() {
	for (let button of keyboard) {
		button.addEventListener("click", function () {
			processInput(this);
		});
	}

	todaysWord = await getNewWord();

	display.querySelector("button").addEventListener("click", function () {
		reset();
	});

	let word = [];
	for (let i = 0; i < allWordEls.length; i += 5) {
		word = [];

		for (let j = 0; j < 5; j++) {
			word.push(allWordEls[i + j]);
		}

		wordElsArr.push(word);
	}

	for (let button of keyboard) {
		keyboardText.push(button.innerHTML);
	}
}

window.onload = onReady();

window.addEventListener(
	"keydown",
	function (event) {
		if (event.defaultPrevented) {
			return;
		}

		let input = "";

		if (event.key.length == 1 && event.key.match(/[a-z]/i)) {
			input = event.key.toUpperCase();
		} else if (event.key == "Enter" || event.key == "Backspace") {
			input = event.key;
		} else {
			return;
		}

		gameLoop(input);

		event.preventDefault();
	},
	true
);

async function getNewWord() {
	const response = await fetch(
		"https://random-word-api.herokuapp.com/word?length=5"
	);
	const data = await response.json();

	return data[0].toUpperCase();
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

async function reset() {
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
	todaysWord = await getNewWord();
}

function getCSScolor(varName) {
	return getComputedStyle(document.body).getPropertyValue(
		"--" + varName + "-color"
	);
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

function checkWin() {
	let currentWord = getCurrentWord();

	let lineColors = [];

	for (let i = 0; i < 5; i++) {
		if (currentWord[i] == todaysWord[i]) {
			lineColors.push("correct-spot");
		} else if (todaysWord.includes(currentWord[i])) {
			lineColors.push("wrong-spot");
		} else {
			lineColors.push("locked");
		}
	}

	let count = 0;
	let currentInstance = 0;

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
					if (
						lineColors[j] == "correct-spot" ||
						lineColors[j] == "wrong-spot"
					) {
						currentInstance++;
					}

					if (currentInstance > count && i >= j) {
						lineColors[i] = "locked";
					}
				}
			}

			if (instancesBefore(currentWord, i) >= count) {
				lineColors[i] == "locked";
			}
		}

		wordElsArr[line][i].style.background = getCSScolor(lineColors[i]);
		wordElsArr[line][i].classList.add("guessed");
		wordElsArr[line][i].classList.remove("entered");
	}

	let indexes = getButtonIndexes();

	for (let i = 0; i < 5; i++) {
		let buttonColor = keyboard[indexes[i]].style.backgroundColor;

		if (buttonColor == getCSScolor("correct-spot")) {
			continue;
		} else if (buttonColor == getCSScolor("wrong-spot")) {
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

function gameLoop(input) {
	if (!allowInput) {
		return;
	}

	currentWord = getCurrentWord();

	switch (input) {
		case "Enter":
			if (currentWord.length == 5) {
				//check word
				if (checkWin()) {
					showMessage("You guessed the word!");
				}
				cursor = 0;
				line++;

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

				cursor++;
			}
	}
}
