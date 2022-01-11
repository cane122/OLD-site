
var pesma;

function getPesme() {
  return pesme; // kasnije ce ovo dobavljati podatke preko backend REST API-ija
}

function loadPesme() {
  if (window.location.href.indexOf("sajt.html") > -1) {
    loadPesmeList(getPesme());
    loadHeader(getPesme());
  } else {
    index = window.location.href.substring(
      window.location.href.indexOf("id=") + 3
    );

    pesma = pesme[index];
    loadOsnovnoOPesmi(pesma);
    loadKomentari(pesma);
    loadOcene(pesma);
  }
}

function loadPesmeList(list) {
  $("#pesme").empty();
  $.each(list, function(index, pesma) {
    $("#pesme").append(
      '<li><a href="muzika.html?id=' +
        index +
        '" target="_blank">' +
        pesma.naziv +
        "</a><br/></li>"
    );
  });
}
function loadLink(pesma) {
  return "<iframe " + pesma.yt + ' frameborder="0" allowfullscreen></iframe>';
}
function loadSlike(){
  return '<img src="notaObojena.png" /><img src="notaObojena.png" /><img src="notaObojena.png" /><img src="notaObojena.png" /><img src="notaObojena.png" />'
}
function loadOsnovnoOPesmi(pesma) {
  $("#nazivPesme").append(pesma.naziv);
  $("#izvodjac").append(pesma.izvodjac);
  $("#link").append(loadLink(pesma));
  $("#genre").append(pesma.genre);
  $("#datum").append(pesma.datum);
  $("#slike").append(loadSlike());
}
function addOcena(){
  let radios=document.getElementsByName("ocena");
  for (var i = 0, length = radios.length; i < length; i++)
{
 if (radios[i].checked)
 {
  // do whatever you want with the checked radio
  pesma.ocena.push(radios[i].value);

  // only one radio can be logically checked, don't check the rest
  break;
 }
}
  loadOcene(pesma);
}
function loadOcene(pesma){
	var prosecna = 0;
	for(var i = 0; i< pesma["ocena"].length; i++) {
		prosecna = parseInt(pesma["ocena"][i]) + prosecna;
	}
	prosecna = prosecna/pesma["ocena"].length;
	$("#prosecna").append('<h4><b>Prosecna ocena je: ' + prosecna +'</b></h4>');
}

function loadKomentari(pesma) {
  document.getElementById("komentari").innerHTML += "<h2>Komentari</h2>"

  pesma.komentari.forEach(myFunction);

  function myFunction(item, index) {
  document.getElementById("komentari").innerHTML += item.autor + ": " + item.tekst + "<br>";
  }
}

function addKomentar(){
  var x = document.getElementById("frm1");
  document.getElementById("komentari").innerHTML += x.elements[0].value+": "+x.elements[1].value+"<br>";
}
$(document).ready(loadPesme);