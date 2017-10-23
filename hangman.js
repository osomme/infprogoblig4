window.onload = oppstart;

var tidIgjen = setInterval(tid, 1000); // Starter en timer som teller ned fra 60.
var ctx = document.getElementById("tegneflate").getContext("2d");

// Array som inneholder det korrekte svaret.
var muligeSvar = ["TIMER", "PERSON", "VINDU", "NORGE", "TOMAT", "EPLE", "BANAN", "ANANAS"];
var svar = muligeSvar[Math.floor(Math.random() * muligeSvar.length)]; // Trekker et tilfeldig korrekt svar.
console.log(svar);


var poeng = 0; // Score-systemet.

var feilBokstaver = []; // Denne arrayen skrives ut og viser bokstaver som er gjettet på men er feil.

var hint = svar.split(""); // Denne skrives ut når siden lastes.
var svarArray = svar.split(""); // Denne brukes til å finne ut om input er lik svaret.


var feilTilstand = 0; // Denne variablen sjekkes for å bestemme hvor langt brukeren
                      //er fra fail-state og for å trigge neste del av tegningen. Verdien 6 er game over.

function oppstart() {
  tid();
  tegnRekt(150, 500, 350, 50, "black"); // Tegner basen på galgen.
  tegnRekt(300, 150, 50, 350, "black"); // Vertikal strek fra galgen.
  tegnRekt(150, 150, 150, 30, "black"); // Horisontal strek på toppen av galgen.
  tegnRekt(220, 180, 10, 80, "black"); // Linja som går ned til strekfiguren.
  lagHint();
  document.getElementById("input").focus();
  document.getElementById("input").oninput = sjekkInput;
  document.getElementById("retryBtn").onclick = retry;
}

// Skriv spørsmålstegn som hint:
function lagHint() {
  for (var i = 0; i < svar.length; i++) {
    hint.fill(" - "); // Fjerner alle verdier i arrayen og erstatter med bindestrek.
  }
  var tilfeldigHint = Math.floor(Math.random() * svar.length);
  // Linja under viser brukeren 1 bokstav som hint. Hintet trekkes tilfeldig.
  hint.splice(tilfeldigHint, 1, svarArray[tilfeldigHint]);
  // join() fjerner komma og konverterer til string.
  document.getElementById("hintUtskrift").innerHTML = hint.join(" ");
}

function sjekkInput() {
  var input = document.getElementById("input").value;

  if (input.length == 1) {
    document.getElementById("input").value = input.toUpperCase();
  }
  testSvar();
}



/*************************************************************
 * Funksjon som sjekker om brukerinput er korrekt.            *
 *************************************************************/

var svarAntall = {feil: 0, korrekt: 0};

function testSvar() {
  // La til toUpperCase for inputen bugger noen ganger og gir ikke uppercase.
  var brukerSvar = document.getElementById("input").value.toUpperCase();

  svarAntall.feil = 0;
  svarAntall.korrekt = 0;

  // Sletter det som står i inputen når du trykker på knappen.
  document.getElementById("input").value = "";

  for (var b = 0; b < svar.length; b++) {
    if (brukerSvar == svarArray[b]) {
      // Hvis svaret er korrekt.
      svarAntall.korrekt++;
      poeng += 2000;
      hint.splice(b, 1, brukerSvar);
      document.getElementById("hintUtskrift").innerHTML = hint.join(" ");
      korrektSvar();
    } else {
      svarAntall.feil++;
    }
  }

  if (svarAntall.feil >= 1 && svarAntall.korrekt == 0) {
    // Hvis svaret er feil.
    feilTilstand++;
    poeng -= 1000;
    feilBokstaver.push(brukerSvar);
    document.getElementById("feilUtskrift").innerHTML = feilBokstaver.join(" ");  }

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

  for (var i = 0; i < svarArray.length; i++) {
    if (hint[i] == svarArray[i]) {
      sjekkOmLike++;
    }
  }
  if (sjekkOmLike == svarArray.length) {
    setInterval(celebration, 20);
    clearInterval(tidIgjen); // Stopper timeren.
    document.getElementById("score").innerHTML = poeng *= (timer * svar.length) / 8; // Endelig poengsum.
    document.getElementById("retryBtn").style.display = "block"; // Vise retry-knapp.
    document.getElementById("input").style.display = "none";
    document.getElementById("retryBtn").focus(); //Setter focus på retry-knappen.
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
    tegnStrek(225, 290, 225, 340, "darkcyan", "butt"); // Mage.
  } else if (feilTilstand == 3) {
    tegnStrek(225, 310, 200, 320, "coral", "round"); // Venstre arm.
  } else if (feilTilstand == 4) {
    tegnStrek(225, 310, 250, 320, "palevioletred", "round"); // Høyre arm.
  } else if (feilTilstand == 5) {
    setInterval(blinkAdvarsel, 300);
  } else if (feilTilstand == 6) {

    gameOver();
  }
}

function gameOver() {
  if (feilTilstand >= 6) {
    tegnSirkel(225, 275, 15, "red"); // Hode.
    tegnStrek(225, 290, 225, 340, "red", "butt"); // Mage.
    tegnStrek(225, 310, 200, 320, "red", "round"); // Venstre arm.
    tegnStrek(225, 310, 250, 320, "red", "round"); // Høyre arm.
    tegnStrek(225, 340, 210, 370, "red", "round"); // Venstre ben.
    tegnStrek(225, 340, 240, 370, "red", "round"); // Høyre ben.
    // Beskjed at du har failet.
    ctx.font = "36px Arial";
    // Hvis spilleren failet fordi de svarte feil 6 ganger.
    if (timer > 0) {
      ctx.fillText("Game over! Du klarte ikke å finne det rette svaret.", 30, 800);
      clearInterval(tidIgjen); // Stopper timeren.
    }
    // Hvis timeren gikk ut.
    else {
      ctx.fillText("Game over! Du gikk tom for tid!", 15, 800);
    }

    document.getElementById("hintUtskrift").innerHTML = svar; // Sriv ut det korrekte svaret.
    document.getElementById("input").style.display = "none";
    // Viser retry-knapp.
    document.getElementById("retryBtn").style.display = "block";
    document.getElementById("retryBtn").focus(); //Gir focus til retry-knappen.
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
    tegnStrek(225, 290, 225, 340, advarselFarge, "butt"); // Mage.
    tegnStrek(225, 310, 200, 320, advarselFarge, "round"); // Venstre arm.
    tegnStrek(225, 310, 250, 320, advarselFarge, "round"); // Høyre arm.
    tegnStrek(225, 340, 210, 370, advarselFarge, "round"); // Venstre ben.
  }
}

/*****************************
 * Animert stikkfigur        *
 *****************************/
// Startposisjoner for figuren i animasjonen.
var pos = {
  x: 68, // Sentrum av figuren på den horisontale aksen.
  hoyreArmY: 660,
  venstreArmY: 780,
  hoyreArmX: 267,
  venstreArmX: 359,
};
var farge = ["blue", "yellow", "green", "lime", "orange", "red", "purple"];

function celebration() {
  var tilfeldigFarge = Math.floor(Math.random() * farge.length);

  // Slett det som allerede står der.
  ctx.clearRect(0, 550, 710, 328);

  // Bilde av Tom Heine.
  var bildeAvTom = document.getElementById("tom");
  ctx.drawImage(bildeAvTom, (pos.x - 30), 595, 60, 60);

  tegnStrek(pos.x, 655, pos.x, 820, "brown"); // Mage
  tegnStrek(pos.x, 820, (pos.x + 60), 880, "blue", "round"); // Høyre ben
  tegnStrek(pos.x, 820, (pos.x - 60), 880, "blue", "round"); // Venstre ben

  tegnStrek(pos.x, 720, (pos.x - 40), pos.hoyreArmY, farge[tilfeldigFarge], "round"); // Høyre arm
  tegnStrek(pos.x, 720, (pos.x + 40), pos.venstreArmY, farge[tilfeldigFarge], "round"); // Venstre arm

  animasjon(); // Call for å starte animasjon av figuren vi har tegnet.
  winTxt();
}

var xRetning = "hoyre";
var yRetning = "ned";

function animasjon() {
  // Beveger armene opp og ned.
  if (pos.hoyreArmY >= 770) {
    yRetning = "ned";
  } else if (pos.hoyreArmY <= 675) {
    yRetning = "opp";
  }

  if (yRetning == "ned") {
    pos.venstreArmY += 3;
    pos.hoyreArmY -= 3;
  } else if (yRetning == "opp") {
    pos.venstreArmY -= 3;
    pos.hoyreArmY += 3;
  }

  // Flytter figuren på X-aksen.
  if (pos.x > 540) {
    xRetning = "venstre";
  } else if (pos.x < 70) {
    xRetning = "hoyre";
  }

  if (xRetning == "venstre") {
    pos.hoyreArmX -= 3;
    pos.x -= 3;
  } else if (xRetning == "hoyre") {
    pos.hoyreArmX += 3;
    pos.x += 3;
  }
}

function winTxt() {
  ctx.font = "24px Arial Black";
  ctx.textAlign = "center";
  ctx.fillStyle = "brown";
  ctx.fillText("Du vant!", pos.x, 580);
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

function tegnStrek(x, y, x2, y2, farge, lc) {
  // Tegner en strek.
  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.lineCap = lc;
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = 5;
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
