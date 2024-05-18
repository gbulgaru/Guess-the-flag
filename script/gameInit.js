let currentCountry = null; // Variabile globale per memorizzare il paese corrente
let gameInProgress = false; // Flag per impedire richieste multiple

$(document).ready(function() {
	$('#startGame').on('click', function() {
		startGame();
		$(this).hide();
	});
	
	$(document).on('click', '#verifyButton', function() {
		if (gameInProgress) {
			verifyAnswer();
			setTimeout(startGame, 3000);
		}
	});
	
	$(document).on('keypress', '#flag-display input', function(e) {
		if (e.which === 13 && gameInProgress) { // Codice 13 è il tasto Invio
			verifyAnswer();
			setTimeout(startGame, 3000);
		}
	});
});

function startGame() {
	gameInProgress = true; // Imposta il flag per indicare che il gioco è in corso
	$("#flag-display, #result").empty();
	
	let selectedContinent = $("#continentSelect").val();
	
	$.getJSON(`https://restcountries.com/v3.1/region/${selectedContinent}`, function(countries) {
		// Seleziona un paese a caso
		let randomCountry = countries[Math.floor(Math.random() * countries.length)];
		currentCountry = randomCountry.name.common; // Memorizza il nome del paese

		// Visualizza l'emoji della bandiera
		let flagEmoji = countryCodeToFlagEmoji(randomCountry.cca2);
		$("#flag-display").append($("<p>").text(flagEmoji));

		// Crea una textbox per l'input dell'utente
		let input = $("<input>").attr("type", "text").attr("placeholder", "Inserisci il nome del paese");
		$("#flag-display").append(input);

		// Crea un pulsante di verifica
		let verifyButton = $("<button>").attr("id", "verifyButton").text("Verifica");
		$("#flag-display").append(verifyButton);

		input.focus(); // Metti a fuoco la textbox per l'input dell'utente
	});
}

function countryCodeToFlagEmoji(countryCode) {
	return String.fromCodePoint(...[...countryCode.toUpperCase()].map(char => 127397 + char.charCodeAt()));
}

function verifyAnswer() {
	if (!gameInProgress) return; // Evita richieste multiple

	gameInProgress = false; // Impedisce ulteriori verifiche fino all'inizio del nuovo gioco
	let userAnswer = $("#flag-display input").val().trim().toLowerCase();
	if (userAnswer === currentCountry.toLowerCase()) {
		$("#flag-display p").empty().text("✅");
	} else {
		let wrongAnswer = $("<div>").text("❌").addClass("wrong-answer");
		let correctCountry = $("<div>").text(`La risposta corretta era ${currentCountry}`).addClass("correct-country");
		$("#flag-display p").empty().append(wrongAnswer, correctCountry);
	}
}