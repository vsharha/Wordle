const keyboard = document.querySelectorAll("#keyboard button");
const display = document.querySelectorAll(".lines .letter");

function onReady() {
	for (let button of keyboard) {
		button.addEventListener("click", function () {
			processInput(this);
		});
	}
}

window.onload = onReady();

function processInput(button) {
	console.log(button.innerHTML);
}
