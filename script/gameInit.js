let currentCountry = null;
let gameInProgress = false; // Flag to prevent multiple requests

$(document).ready(function() {
	$('#flagToName').on('click', function() {
		flagToName();
		$(this).hide();
		$('#nameToFlag').hide();
	});

	$('#nameToFlag').on('click', function() {
		nameToFlag();
		$(this).hide();
		$('#flagToName').hide();
	});

	$(document).on('click', '#verifyButton', function() {
		if (gameInProgress) {
			verifyAnswer();
		}
	});

	$(document).on('keypress', '#responseArea input', function(e) {
		if (e.which === 13 && gameInProgress) { // Code 13 is the Enter key
			verifyAnswer();
		}
	});
});

function nameToFlag() {
	gameInProgress = true; // Set the flag to indicate that the game is in progress
	$("#initialPrompt").empty();
	$("#responseArea").empty();

	let selectedContinent = $("#continentSelect").val();

	$.getJSON(`https://restcountries.com/v3.1/region/${selectedContinent}?fields=name,cca2`, function(countries) {
		// Select a random country
		let randomCountry = countries[Math.floor(Math.random() * countries.length)];
		currentCountry = randomCountry; // Store the country object

		// Display the country name
		$("#initialPrompt").text(randomCountry.name.common);

		// Create and display the flags
		let flagContainer = [];
		for (let i = 0; i < 3; i++) {
			let country = i === 0 ? randomCountry : countries[Math.floor(Math.random() * countries.length)];
			let flagImage = $("<p>").text(countryCodeToFlagEmoji(country.cca2)).data("country", country.name.common);
			flagContainer.push(flagImage);
		}

		// Shuffle the flags
		flagContainer.sort(function() { return 0.5 - Math.random(); });

		// Add the flags to the display and set the click event
		flagContainer.forEach(flag => {
			$("#responseArea").append(flag);
			flag.on('click', function() {
				if (gameInProgress) {
					verifyFlagSelection($(this).data("country"));
				}
			});
		});

		$("#responseArea p").css("display", "inline");
	});
}

function flagToName() {
	gameInProgress = true; // Set the flag to indicate that the game is in progress
	$("#initialPrompt").empty();
	$("#responseArea").empty();

	let selectedContinent = $("#continentSelect").val();

	$.getJSON(`https://restcountries.com/v3.1/region/${selectedContinent}?fields=name,cca2`, function(countries) {
		// Select a random country
		let randomCountry = countries[Math.floor(Math.random() * countries.length)];
		currentCountry = randomCountry; // Store the country object

		// Display the flag emoji
		let flagEmoji = countryCodeToFlagEmoji(randomCountry.cca2);
		$("#initialPrompt").text(flagEmoji);

		// Create a textbox for user input
		let input = $("<input>").attr("type", "text").attr("placeholder", "Write the country name in English");
		$("#responseArea").append(input);

		// Create a verify button
		let verifyButton = $("<button>").attr("id", "verifyButton").text("Verify");
		$("#responseArea").append(verifyButton);

		input.focus();
	});
}

function countryCodeToFlagEmoji(countryCode) {
	return String.fromCodePoint(...[...countryCode.toUpperCase()].map(char => 127397 + char.charCodeAt()));
}

function verifyFlagSelection(selectedCountry) {
	gameInProgress = false; // Prevent further verification until the new game starts
	$("#responseArea").empty();
	if (selectedCountry.toLowerCase() === currentCountry.name.common.toLowerCase()) {
		$("#initialPrompt").text("✅");
	} else {
		$("#initialPrompt").text("❌");
		$("#responseArea").text("The correct answer was " + countryCodeToFlagEmoji(currentCountry.cca2));
	}
	setTimeout(nameToFlag, 2000);
}

function verifyAnswer() {
	if (!gameInProgress) return; // Prevent multiple requests

	gameInProgress = false; // Prevent further verification until the new game starts
	let userAnswer = $("#responseArea input").val().trim().toLowerCase();
	$("#responseArea").empty();
	if (userAnswer === currentCountry.name.common.toLowerCase()) {
		$("#responseArea").text("✅");
	} else {
		$("#initialPrompt").text("❌");
		$("#responseArea").text(`The correct answer was ${currentCountry.name.common}`);
	}
	setTimeout(flagToName, 2000);
}