window.onload = oppstart;

var ctx = document.getElementById("tegneflate").getContext("2d");

var muligeSvar = ["TIMER", "PERSON", "VINDU", "NORGE", "TOMAT", "EPLE", "BANAN", "ANANAS"]; // Det korrekte svaret.

var svar = muligeSvar[Math.floor(Math.random() * muligeSvar.length)]; // Trekker et tilfeldig korrekt svar.
console.log(svar);

var hint = svar.split(""); // Denne skrives ut når siden lastes.
const hint2 = svar.split(""); // Denne brukes til å finne ut om input er lik svaret.


var feilTilstand = 0; // Denne variablen sjekkes for å bestemme hvor langt brukeren er fra fail-state og for å trigge neste del av tegningen. Verdien 6 er game over.

function oppstart() {
  tegnRekt(150, 500, 350, 50); // Tegner basen på galgen.
  tegnRekt(300, 150, 50, 350); // Vertikal strek fra galgen.
  tegnRekt(150, 150, 150, 30); // Horisontal strek på toppen av galgen.
  tegnRekt(220, 180, 10, 80); // Linja som går ned til strekfiguren.
  lagHint();
  document.getElementById("input").oninput = sjekkInput;
  document.getElementById("btn").onclick = testSvar;
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
}



/*************************************************************
* Funksjon som sjekker om brukerinput er korrekt.            *
*************************************************************/
function testSvar() {
  // La til toUpperCase for inputen bugger noen ganger og gir ikke uppercase.
  var brukerSvar = document.getElementById("input").value.toUpperCase();

  var feilSvarAntall = 0;
  var korrektSvarAntall = 0;

  // Sletter det som står i inputen når du trykker på knappen.
  document.getElementById("input").value = "";

  for (var b = 0; b < svar.length; b++) {
    if (brukerSvar == hint2[b]) {
      // Hvis svaret er korrekt.
      korrektSvarAntall++;
      hint.splice(b, 1, brukerSvar);
      document.getElementById("hintUtskrift").innerHTML = hint.join(" ");
      korrektSvar();
    }
    else {
      feilSvarAntall++;
    }
  }

  if (feilSvarAntall >= 1 && korrektSvarAntall < 1) {
    feilTilstand++;
  }

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
    document.getElementById("retryBtn").style.display = "block";
  }
}


/*************************************************************
* Funksjon som sjekker fail-nivå og tegner hangman-figuren.  *
*************************************************************/
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
    tegnStrek(225, 340, 210, 370, "orangered"); // Venstre ben.
  } else if (feilTilstand >= 6) {
    tegnStrek(225, 340, 240, 370, "black"); // Høyre ben.
    // Beskjed hvis du har failet.
    ctx.font = "40px Arial";
    ctx.fillText("Game over! Du klarte ikke å finne det rette svaret", 15, 800);
    // Fjerner "Sjekk svar" knappen og inputboksen.
    document.getElementById("btn").style.display = "none";
    document.getElementById("input").style.display = "none";
    // Viser retry-knapp.
    document.getElementById("retryBtn").style.display = "block";
  }
}





/*************************************************************
* Animert stikkfigur som vises når spilleren vinner.         *
*************************************************************/
var hoyreArmY = 660;
var venstreArmY = 780;

var yRetning = "ned";

var farge = ["blue", "yellow", "green", "lime","orange","red","purple"];

function celebration() {
  // Slett det som allerede står der.
  ctx.beginPath();
  ctx.rect(150, 640, 350, 300);
  ctx.fillStyle = "white";
  ctx.fill();

  // Tegner hodet på stikkfiguren.
  tegnSirkel(320, 620, 35, "black");
  // Øyne
  tegnSirkel(305, 610, 5, "black");
  tegnSirkel(335, 610, 5, "black");
  // Munn
  ctx.beginPath();
  ctx.arc(320, 630, 20, 0, Math.PI);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.stroke();

  tegnStrek(320, 655, 320, 820, "black"); // Mage
  tegnStrek(320, 820, 380, 880, "black"); // Høyre ben
  tegnStrek(320, 820, 260, 880, "black"); // Venstre ben

  tegnStrek(320, 720, 280, hoyreArmY, farge[Math.floor(Math.random() * farge.length)]); // Høyre arm
  tegnStrek(320, 720, 360, venstreArmY, farge[Math.floor(Math.random() * farge.length)]); // Venstre arm

  if (hoyreArmY == 792) {
    yRetning = "ned";
  }
  else if (hoyreArmY == 660) {
    yRetning = "opp";
  }

  if (yRetning == "ned") {
    hoyreArmY -= 3;
    venstreArmY += 3;
  }
  else if (yRetning == "opp") {
    hoyreArmY += 3;
    venstreArmY -= 3;
  }
}


/*************************************************************
* Funksjoner for tegning av sirkler, streker og firkanter.   *
*************************************************************/
function tegnRekt(x, y, b, h) {
  // Tegner et rektangel.
  ctx.rect(x, y, b, h);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.stroke();
}

function tegnStrek(x, y, x2, y2, farge) {
  // Tegner en strek.
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = farge;
  ctx.stroke();
}

function tegnSirkel(x, y, r, farge) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.strokeStyle = farge;
  ctx.lineWidth = 3;
  ctx.stroke();
}
