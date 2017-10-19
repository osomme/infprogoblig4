window.onload = oppstart;

var tidIgjen = setInterval(tid, 1000); // Starter en timer som teller ned fra 60.

var ctx = document.getElementById("tegneflate").getContext("2d");
// Det korrekte svaret.
var muligeSvar = ["TIMER", "PERSON", "VINDU", "NORGE", "TOMAT", "EPLE", "BANAN", "ANANAS"];

var poeng = 0; // Spillet har et score-system.

var svar = muligeSvar[Math.floor(Math.random() * muligeSvar.length)]; // Trekker et tilfeldig korrekt svar.
console.log(svar);

var feilBokstaver = []; // Denne arrayen skrives ut og viser bokstaver som er gjettet på men er feil.

var hint = svar.split(""); // Denne skrives ut når siden lastes.
const hint2 = svar.split(""); // Denne brukes til å finne ut om input er lik svaret.


var feilTilstand = 0; // Denne variablen sjekkes for å bestemme hvor langt brukeren er fra fail-state og for å trigge neste del av tegningen. Verdien 6 er game over.

function oppstart() {
  tegnRekt(150, 500, 350, 50, "black"); // Tegner basen på galgen.
  tegnRekt(300, 150, 50, 350, "black"); // Vertikal strek fra galgen.
  tegnRekt(150, 150, 150, 30, "black"); // Horisontal strek på toppen av galgen.
  tegnRekt(220, 180, 10, 80, "black"); // Linja som går ned til strekfiguren.
  lagHint();
  document.getElementById("input").oninput = sjekkInput;
  document.getElementById("btn").onclick = testSvar;
  document.getElementById("retryBtn").onclick = retry;
}

// Skriv spørsmålstegn som hint:
function lagHint() {
  for (var i = 0; i < svar.length; i++) {
    hint.fill(" - "); // Fjerner alt i arrayen og erstatter med bindestrek.
  }
  var tilfeldigHint = Math.floor(Math.random() * svar.length);
  // Linja under viser brukeren 1 bokstav som hint. Hintet trekkes tilfeldig.
  hint.splice(tilfeldigHint, 1, hint2[tilfeldigHint]);
  // join() fjerner komma og konverterer til string.
  document.getElementById("hintUtskrift").innerHTML = hint.join(" ");
}

function sjekkInput() {
  /* Denne funksjoner begrenser brukeren til 1 bokstav i inputboksen.
      Den gjør i tillegg bokstaven til stor bokstav. */
  var input = document.getElementById("input").value;

  if (input.length == 1) {
    document.getElementById("input").value = input.toUpperCase();
  }
  if (input.length > 1) {
    document.getElementById("input").value = input.slice(0, 1);
  }
  testSvar();
}



/*************************************************************
 * Funksjon som sjekker om brukerinput er korrekt.            *
 *************************************************************/
var feilSvarAntall = 0;
var korrektSvarAntall = 0;

function testSvar() {
  // La til toUpperCase for inputen bugger noen ganger og gir ikke uppercase.
  var brukerSvar = document.getElementById("input").value.toUpperCase();

  feilSvarAntall = 0;
  korrektSvarAntall = 0;

  // Sletter det som står i inputen når du trykker på knappen.
  document.getElementById("input").value = "";

  for (var b = 0; b < svar.length; b++) {
    if (brukerSvar == hint2[b]) {
      // Hvis svaret er korrekt.
      korrektSvarAntall++;
      poeng += 2000;
      hint.splice(b, 1, brukerSvar);
      document.getElementById("hintUtskrift").innerHTML = hint.join(" ");
      korrektSvar();
    } else {
      feilSvarAntall++;
    }
  }

  if (feilSvarAntall >= 1 && korrektSvarAntall < 1) {
    feilTilstand++;
    poeng -= 1000;
    feilBokstaver.push(brukerSvar);
    document.getElementById("feilUtskrift").innerHTML = feilBokstaver.join(" ");
  }

  document.getElementById("score").innerHTML = "Poeng: " + poeng; // Skriver ut poengsummen.
  feilSjekk();
}



/*************************************************************
 * Funksjon som sjekker om HELE SVARET er korrekt.            *
 *************************************************************/
function korrektSvar() {
  /* Denne funksjonen sjekker om arrayet som ble skapt av svarene til brukeren
    er lik arrayen til det korrekte svaret. */
  var sjekkOmLike = 0;

  for (var i = 0; i < hint2.length; i++) {
    if (hint[i] == hint2[i]) {
      sjekkOmLike++;
    }
  }
  if (sjekkOmLike == hint2.length) {
    setInterval(celebration, 25);
    clearInterval(tidIgjen); // Stopper timeren, siden spilleren har rett svar.
    document.getElementById("score").innerHTML = poeng *= timer; // Endelig poengsum.
    document.getElementById("retryBtn").style.display = "block"; // Vise retry-knapp.
    document.getElementById("btn").style.display = "none"; // Skjuler "sjekk svar" knappen.
  }
}


/***********
 * Timer.  *
 **********/
var timer = 60; // sekunder.
function tid() {
  if (timer <= 15 && timer > 0) {
    document.getElementById("timer").style.color = "red";
    document.getElementById("timer").style.fontSize = "70px";
    document.getElementById("timer").innerHTML = timer;
    timer--;
  } else if (timer == 0) {
    timer = 0;
    document.getElementById("timer").innerHTML = timer;
    feilTilstand = 6;
    feilSjekk();
  } else {
    timer--;
    document.getElementById("timer").innerHTML = timer + " sekunder gjenstår";
  }
}



/**************************************************************
 * Funksjoner som sjekker fail-nivå og tegner hangman-figuren.*
 **************************************************************/
function feilSjekk() {
  /* Hver gang brukeren skriver feil svar øker variablen feilTilstand med 1.
    Når feilTilstand øker til verdien 6, er spillet over og spilleren har tapt.*/

  if (feilTilstand == 1) {
    tegnSirkel(225, 275, 15, "green"); // Tegn hode.
  } else if (feilTilstand == 2) {
    tegnStrek(225, 290, 225, 340, "darkcyan"); // Mage.
  } else if (feilTilstand == 3) {
    tegnStrek(225, 310, 200, 320, "coral"); // Venstre arm.
  } else if (feilTilstand == 4) {
    tegnStrek(225, 310, 250, 320, "palevioletred"); // Høyre arm.
  } else if (feilTilstand == 5) {
    setInterval(blinkAdvarsel, 300);
    tegnStrek(225, 340, 210, 370, "orangered"); // Venstre ben.
  }
  gameOver();
}

function gameOver() {
  if (feilTilstand >= 6) {
    tegnSirkel(225, 275, 15, "red"); // Hode.
    tegnStrek(225, 290, 225, 340, "red"); // Mage.
    tegnStrek(225, 310, 200, 320, "red"); // Venstre arm.
    tegnStrek(225, 310, 250, 320, "red"); // Høyre arm.
    tegnStrek(225, 340, 210, 370, "red"); // Venstre ben.
    tegnStrek(225, 340, 240, 370, "red"); // Høyre ben.
    // Beskjed at du har failet.
    ctx.font = "36px Arial";
    // Hvis spilleren failet fordi hangman-figuren ble ferdig tegnet.
    if (timer > 0) {
      ctx.fillText("Game over! Du klarte ikke å finne det rette svaret", 15, 800);
      clearInterval(tidIgjen); // Stopper timeren.
    }
    // Hvis timeren gikk ut.
    else {
      ctx.fillText("Game over! Du gikk tom for tid!", 15, 800);
    }

    document.getElementById("hintUtskrift").innerHTML = svar;

    // Fjerner "Sjekk svar" knappen og inputboksen.
    document.getElementById("btn").style.display = "none";
    document.getElementById("input").style.display = "none";
    // Viser retry-knapp.
    document.getElementById("retryBtn").style.display = "block";
  }
}



/******************************************************************************************
 * Gjør hangman-figuren til blinkende for å advare brukeren om at de har ett forsøk igjen.*
 ******************************************************************************************/
var advarselFarge = "red";

function blinkAdvarsel() {
  if (advarselFarge == "red") {
    advarselFarge = "white";
  } else {
    advarselFarge = "red";
  }

  if (feilTilstand == 5) {
    tegnSirkel(225, 275, 15, advarselFarge); // Hode.
    tegnStrek(225, 290, 225, 340, advarselFarge); // Mage.
    tegnStrek(225, 310, 200, 320, advarselFarge); // Venstre arm.
    tegnStrek(225, 310, 250, 320, advarselFarge); // Høyre arm.
    tegnStrek(225, 340, 210, 370, advarselFarge); // Venstre ben.
  }
}

/**************************************************************
 * Animert stikkfigur som vises når spilleren vinner.         *
 **************************************************************/
var hoyreArmY = 660;
var venstreArmY = 780;

var yRetning = "ned";

var farge = ["blue", "yellow", "green", "lime", "orange", "red", "purple"];

function celebration() {
  var tilfeldigFarge = Math.floor(Math.random() * farge.length);

  // Slett det som allerede står der.
  ctx.beginPath();
  ctx.rect(150, 580, 350, 300);
  ctx.fillStyle = "white";
  ctx.fill();

  // Tegner hodet på stikkfiguren.
  tegnSirkel(320, 620, 35, "black");
  // Øyne
  tegnSirkel(305, 610, 5, "red");
  tegnSirkel(335, 610, 5, "red");
  // Munn
  ctx.beginPath();
  ctx.arc(320, 630, 20, 0, Math.PI);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 3;
  ctx.stroke();

  tegnStrek(320, 655, 320, 820, "brown");// Mage
  tegnStrek(320, 820, 380, 880, "blue"); // Høyre ben
  tegnStrek(320, 820, 260, 880, "blue"); // Venstre ben

  tegnStrek(320, 720, 280, hoyreArmY, farge[tilfeldigFarge]); // Høyre arm
  tegnStrek(320, 720, 360, venstreArmY, farge[tilfeldigFarge]); // Venstre arm

  if (hoyreArmY >= 770) {
    yRetning = "ned";
  } else if (hoyreArmY <= 675) {
    yRetning = "opp";
  }

  if (yRetning == "ned") {
    hoyreArmY -= 3;
    venstreArmY += 3;
  } else if (yRetning == "opp") {
    hoyreArmY += 3;
    venstreArmY -= 3;
  }
}


/*************************************************************
 * Funksjoner for tegning av sirkler, streker og firkanter.   *
 *************************************************************/
function tegnRekt(x, y, b, h, farge) {
  // Tegner et rektangel.
  ctx.rect(x, y, b, h);
  ctx.fillStyle = farge;
  ctx.fill();
  ctx.stroke();
}

function tegnStrek(x, y, x2, y2, farge) {
  // Tegner en strek.
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = farge;
  ctx.fill();
  ctx.stroke();
}

function tegnSirkel(x, y, r, farge) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.strokeStyle = farge;
  ctx.lineWidth = 3;
  ctx.stroke();
}

/* Laster siden på nytt */
function retry() {
  location.reload();
}
