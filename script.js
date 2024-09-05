const keyboard = document.querySelectorAll("#keyboard button");
const keyboardText = [];
const display = document.querySelectorAll(".lines .letter");
let wordElsArr = [];

let line = 0;
let cursor = 0;

let todaysWord = "moped";

function onReady() {
	for (let button of keyboard) {
		button.addEventListener("click", function () {
			processInput(this);
		});
	}

	let word = [];
	for (let i = 0; i < display.length; i++) {
		if (i % 5 == 0 && i != 0) {
			wordElsArr.push(word);
			word = [];
		}

		word.push(display[i]);
	}

	for (let button of keyboard) {
		keyboardText.push(button.innerHTML);
	}
}

window.onload = onReady();

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
	words = getStrWords();

	let currentWord = "";

	for (let word of words) {
		if (word.length == 0) {
			break;
		}

		currentWord = word;
	}

	return currentWord;
}

function reset() {
	line = 0;
	cursor = 0;
	for (let letter of display) {
		letter.innerHTML = "";
		letter.classList.remove(entered);
		letter.style.background = "none";
	}
	for (let button of keyboard) {
		button.classList.remove("guessed");
	}
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
		if (index > -1 && !indexes.includes(index)) {
			indexes.push(index);
		}
	}

	return indexes;
}

function updateColors() {
	for (let i = 0; i < 5; i++) {
		wordElsArr[line][i].style.background = getCSScolor("locked");
		wordElsArr[line][i].classList.add("guessed");
	}

	for (let i of getButtonIndexes()) {
		keyboard[i].style.background = getCSScolor("locked");
		keyboard[i].classList.add("guessed");
	}
}

function processInput(button) {
	currentWord = getCurrentWord();

	switch (button.id) {
		case "enter":
			if (currentWord.length == 5) {
				//check word
				updateColors();
				cursor = 0;
				line++;
			}
			return;
		case "delete":
			if (cursor > 0) {
				cursor--;
			}
			wordElsArr[line][cursor].classList.remove("entered");
			wordElsArr[line][cursor].innerHTML = "";

			return;
	}

	//let word = getCurrentWord();
	//console.log(word);

	if (cursor < 5 && wordElsArr[line][cursor].innerHTML.length == 0) {
		wordElsArr[line][cursor].innerHTML = button.innerHTML;
		wordElsArr[line][cursor].classList.add("entered");

		cursor++;
	}
}
