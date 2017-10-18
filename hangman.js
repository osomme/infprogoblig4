window.onload = oppstart;

var ctx = document.getElementById("tegneflate").getContext("2d");

var muligeSvar = ["TIMER", "PERSON", "VINDU", "NORGE", "TOMAT"]; // Det korrekte svaret.

var svar = muligeSvar[Math.floor(Math.random() * muligeSvar.length)]; // Trekker et tilfeldig korrekt svar.
console.log(svar);

var hint = svar.split(""); // Denne skrives ut når siden lastes.
const hint2 = svar.split(""); // Denne brukes til å finne ut om input er lik svaret.


var feilTilstand = 0; // Denne variablen sjekkes for å bestemme hvor langt brukeren er fra fail-state og å trigge neste del av tegningen. Verdien 6 er fail.

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

/*  while (brukerSvar != hint2[b]) {
    // Hvis svaret er feil.
    feilTilstand++;
    break;
  } */
  feilSjekk();
}

/*
function visKorrekt(t, x) {
  ctx.font = "40px Arial";
  ctx.textDecoration = "underline";
  ctx.textAlign = "center";
  ctx.textColor = "blue";
  ctx.fillText(t, x, 200);
} */

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
    alert("Yay!");
  }
}

function feilSjekk() {
  /* Hver gang brukeren skriver feil svar øker variablen feilTilstand med 1.
    Når feilTilstand øker til verdien 6, er spillet over og spilleren har tapt.*/

  if (feilTilstand == 1) {
    tegnHode(); // Tegn hode.
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

function tegnRekt(x, y, b, h) {
  // Tegner et rektangel.
  ctx.rect(x, y, b, h);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.stroke();
}

function tegnHode() {
  // Tegner hodet på stikkfiguren.
  ctx.beginPath();
  ctx.arc(225, 275, 15, 0, 2 * Math.PI);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 3;
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
