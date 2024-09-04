const keyboard = document.querySelectorAll("#keyboard button");
const display = document.querySelectorAll(".lines .letter");
let wordEls = [];

let line = 0;
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

		word.push(display[i]);
	}
}

window.onload = onReady();

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
	}
}

function processInput(button) {
	currentWord = getCurrentWord();

	switch (button.id) {
		case "enter":
			//check word
			console.log(currentWord); //broken
			if (currentWord.length == 5) {
				cursor = 0;
				line++;
			}
			return;
		case "delete":
			wordEls[line][cursor].innerHTML = "";
			if (cursor != 0) {
				cursor--;
			}
			return;
	}

	console.log(wordEls);

	//let word = getCurrentWord();
	//console.log(word);

	if (wordEls[line][cursor].innerHTML.length == 0) {
		wordEls[line][cursor].innerHTML = button.innerHTML;
	}

	if (cursor < 4) {
		cursor++;
	}
}
