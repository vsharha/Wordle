const keyboard = document.querySelectorAll("#keyboard button");
const keyboardText = [];
const display = document.querySelectorAll(".lines .letter");
let wordElsArr = [];

let allowInput = true;
let line = 0;
let cursor = 0;

let todaysWord = "MOPED";

function onReady() {
	for (let button of keyboard) {
		button.addEventListener("click", function () {
			processInput(this);
		});
	}

	let word = [];
	for (let i = 0; i < display.length; i += 5) {
		word = [];

		for (let j = 0; j < 5; j++) {
			word.push(display[i + j]);
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
	line = 0;
	cursor = 0;
	for (let letter of display) {
		letter.classList.remove("guessed");
		letter.innerHTML = "";
		letter.style.background = "none";
	}
	for (let button of keyboard) {
		button.classList.remove("guessed");
		button.style.background = getCSScolor("button");
	}
	allowInput = true;
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

function checkWin() {
	let currentWord = getCurrentWord();

	let color = "";
	let lineColors = [];
	let correctCount = 0;

	for (let i = 0; i < 5; i++) {
		if (currentWord[i] == todaysWord[i]) {
			correctCount++;
			color = "correct-spot";
		} else if (todaysWord.includes(currentWord[i])) {
			color = "wrong-spot";
		} else {
			color = "locked";
		}

		wordElsArr[line][i].style.background = getCSScolor(color);
		wordElsArr[line][i].classList.add("guessed");
		wordElsArr[line][i].classList.remove("entered");

		lineColors.push(color);
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

function gameLoop(input) {
	if (!allowInput) {
		return;
	}

	currentWord = getCurrentWord();

	switch (input) {
		case "Enter":
			if (currentWord.length == 5) {
				console.log(currentWord);
				//check word
				if (checkWin()) {
					allowInput = false;

					alert("You guessed it!");
				}
				cursor = 0;
				line++;
			}

			if (line > 5) {
				allowInput = false;
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
