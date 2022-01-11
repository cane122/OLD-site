let pesme = [];

let SongManager = {
  basePath: function () {
    return "http://localhost:5000/api/songDetails/";
  },

  loadSongs: function () {
    $.ajax({
      url: this.basePath() + "/",
      dataType: "json",
      cache: false,
      success: function (data) {
        pesme = data;
        console.log(pesme);
        return true;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert(textStatus);
      },
    });
  },
  dodajOcenu: function (id,o) {
    $.ajax({
      url: this.basePath() + "/" + id + "/oceni/",
      cache: false,
      dataType: "json",
      type: 'PUT',
      data: { ocena: Number(o) },
      success: function (res) {
        $("#prosecna").empty();

        $("#prosecna").append("Prosecna ocena:" + pesma.prosecnaOcena);
      },
    });
  },
  addComment: function (komentar) {
    $.ajax({
      url: this.basePath() + "/komentar/" + pesma._id + "/",
      type: 'PUT',
      cache: false,
      dataType: "json",
      data: komentar,
      success: function (res) {
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert(textStatus);
      },
    });
  },
  showSongList: function () {
    $.ajax({
      url: this.basePath() + "/",
      cache: false,
      dataType: "json",
      success: function (list) {
        $("#songs").empty();
        $.each(list, function (index, song) {
          $("#songs").append(
            '<li><a href="muzika.html?id=' +
              song._id +
              '" target="_blank">' +
              song.name +
              "</a><br/></li>"
          );
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("error");
      },
    });
  },
};

SongManager.loadSongs();

function loadPesme() {
  if (window.location.href.indexOf("sajt.html") > -1) {
    setTimeout(function () {
      loadPesmeList(pesme);
    }, 100);
  } else {
    index = window.location.href.substring(
      window.location.href.indexOf("id=") + 3
    );
    setTimeout(function () {
      pesma = pesme.find((x) => x._id === index);
      loadOsnovnoOPesmi(pesma);
      loadKomentari(pesma);
      loadOcene(pesma);
    }, 100);
  }
}
function loadPesmeList(list) {
  $("#pesme").empty();
  console.log(pesme);
  $.each(list, function (index, pesma) {
    $("#pesme").append(
      '<li><a href="muzika.html?id=' +
        pesma._id +
        '" target="_blank">' +
        pesma.title +
        "</a><br/></li>"
    );
  });
}
function loadLink(pesma) {
  return (
    "<iframe " + pesma.youtubeUrl + ' frameborder="0" allowfullscreen></iframe>'
  );
}
function loadSlike() {
  return '<img src="notaObojena.png" /><img src="notaObojena.png" /><img src="notaObojena.png" /><img src="notaObojena.png" /><img src="notaObojena.png" />';
}
function loadOsnovnoOPesmi(pesma) {
  $("#nazivPesme").append(pesma.title);
  $("#izvodjac").append(pesma.izvodjac);
  $("#link").append(loadLink(pesma));
  $("#genre").append(pesma.genre);
  $("#datum").append(pesma.year);
  $("#slike").append(loadSlike());
}
function addOcena() {
  let radios = document.getElementsByName("ocena");
  for (let i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
        console.log(radios[i].value);
      // do whatever you want with the checked radio
      SongManager.dodajOcenu(
        window.location.href.substring(window.location.href.indexOf("id=") + 3),
        Number(radios[i].value)
      );

      // only one radio can be logically checked, don't check the rest
      break;
    }
  }
  loadOcene(pesma);
}
function loadOcene(pesma) {
  $("#prosecna").append(
    "<h4><b>Prosecna ocena je: " + pesma.ocena + "</b></h4>"
  );
}

function loadKomentari(pesma) {
  document.getElementById("komentari").innerHTML += "<h2>Komentari</h2>";

  pesma.comments.forEach(myFunction);

  function myFunction(item, index) {
    document.getElementById("komentari").innerHTML +=
      item.autor + ": " + item.tekst + "<br>";
    if (index.replies != undefined) index.replies.forEach(mySecondFunction);
  }
  function mySecondFunction(item, index) {
    if (item.ime == undefined) item.ime = "";
    if (item.tekst == undefined) item.ime = "";

    document.getElementById("komentari").innerHTML +=
      " odgovor:" + item.ime + ": " + item.tekst + "<br>";
  }
}

function addKomentar() {
  let x = document.getElementById("frm1");
  /**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  let komentar = {
      'id': getRandomInt(0,10000),
      'autor': x.elements[0].value,
      'tekst': x.elements[1].value
  }
  console.log(komentar);
  SongManager.addComment(komentar);
  document.getElementById("komentari").innerHTML +=
    x.elements[0].value + ": " + x.elements[1].value + "<br>";
}

$(document).ready(loadPesme);
