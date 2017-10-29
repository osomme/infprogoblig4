window.onload = oppstart;

var ctx = document.getElementById("tegneflate").getContext("2d");

var spill = {
  tider: [],
  utskrift: document.getElementById("utskrift"),
  klikkbarOverflate: document.getElementById("boks"),
  avg: document.getElementById("gjennomsnitt"),
  vis: document.getElementById("spillelementer"),
};

var info = {
  vis: document.getElementById("hjelp"),
  knapp: document.getElementById("hjelpBtn"),
};

var timing = {
  random: 0,
  start: Date.now(),
  stopp: Date.now()
};

function oppstart() {
  info.knapp.onclick = nyttSpill;
  window.onkeypress = nyttSpill;
}

function nyttSpill() {
  info.vis.style.display = "none";
  spill.vis.style.display = "block";
  ctx.clearRect(0,0,900,900);
  timing.random = Math.random() * 3000 + 1500;
  setTimeout(startSpill, timing.random);
  console.log("test");
}

function startSpill() {
  // Å bruke setInterval til å øke timer med 1 hvert ms er ikke nøyaktig
  // på grunn av begrensinger i JS. Bruker derfor Date() i stedet.
  timing.start = Date.now();
  tegnSirkel(450, 450, 250, "red");
  spill.klikkbarOverflate.style.display = "block";
  spill.klikkbarOverflate.onclick = stoppSpill;
}

function stoppSpill() {
  timing.stopp = Date.now();
  ctx.clearRect(0,0,900,900);
  //tegnSirkel(450, 450, 250, "green");
  spill.klikkbarOverflate.style.display = "none";
  tid();
  retryHint();
}

function tid() {
  spill.tider.push(timing.stopp-timing.start);
  spill.tider.sort(function(a, b){return a-b;});
  besteTider();
}

function besteTider() {
  var ut = [];
  for (var i = 0; i <= 5; i++) {
    ut += spill.tider[i] + "<br />";
  }
  spill.avg.innerHTML = "Gjennomsnitt: " + (sum(spill.tider) / spill.tider.length).toFixed(0);
  spill.utskrift.innerHTML = ut;
}

function retryHint() {
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Trykk på enhver tast for å prøve igjen!", 450, 100);
}

// Funksjon som tegner en sirkel.
function tegnSirkel(x, y, r, farge) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.strokeStyle = farge;
  ctx.lineWidth = 3;
  ctx.fillStyle = farge;
  ctx.fill();
  ctx.stroke();
}

// Funksjon som summerer alle tall i en array
function sum(arr) {
  var s = 0;
  for (var i = 0; i < arr.length; i++) {
    s += arr[i];
  }
  return s;
}
