const keyboard = document.querySelectorAll("#keyboard button");
const display = document.querySelectorAll(".lines .letter");
let wordEls = [];

let cursor = 0;

function onReady() {
	for (let button of keyboard) {
		button.addEventListener("click", function () {
			processInput(this);
		});
	}

	let word = [];
	for (let i = 0; i < display.length; i++) {
		if (i % 5 == 0 && i != 0) {
			wordEls.push(word);
			word = [];
		}

		word.push(display[i].innerHTML);
	}
}

window.onload = onReady();

function reset() {
	cursor = 0;
	for (let letter of display) {
		letter.innerHTML = "";
	}
}

function getStrWords() {
	let words = [];
	for (let word of wordEls) {
		words.push(word.join(""));
	}
	return words;
}

function getCurrentWord() {
	words = getStrWords();

	let currentWord = "";

	for (let word of words) {
		if (word.length != 5) {
			break;
		}
		currentWord = word;
	}

	return currentWord;
}

function reset() {
	cursor = 0;
}

function processInput(button) {
	switch (button.id) {
		case "enter":
			return;
		case "delete":
			return;
	}

	display[cursor].innerHTML = button.innerHTML;

	let word = getCurrentWord();
	console.log(word);

	cursor++;
	if (cursor > 29) {
		reset();
	}
}
