let pesme = [];

let SongManager = {
    basePath: function () { return 'http://localhost:5000/api/songDetails/';},

    loadSongs: function () {

        $.ajax({
            url: this.basePath() + '/',
            dataType: 'json',
            cache: false,
            success:function (data){
                pesme = data;
                console.log(pesme);
            },
            error: function (jqXHR, textStatus, errorThrown){
                alert(textStatus);
            }
        });
    },
    dodajOcenu: function(){
        $.ajax({
            url: this.basePath() + '/' + id + '/ocena/',
            type: PUT,
            cache: false,
            dataType: 'json',
            data: {ocena:o},
            success:function (res){
                $('#prosecna').empty();    
                $('#prosecna').append("Prosecna ocena:"+ pesma.prosecnaOcena);    
            },
        });
    },
    addGrade: function(ocena){
        const id = pesma['_id']
        $.ajax({
            url: this.basePath() + '/' + id + '/ocena',
            type: PUT,
            cache: false,
            dataType: 'json',
            data: {ocena:ocena},
            success:function (res){
                $('#prosecna').empty();    
                $('#prosecna').append("Prosecna ocena:"+ pesma.prosecnaOcena);    
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert(textStatus);
            }
        });
    },
    addComment: function(){
        const id = pesma['_id']
        const autor = $("#autor0").val();
        const com = $("#text0").val();
        const name = $("#naziv0").val();
        $.ajax({
            url: this.basePath() + '/' + id + '/ocena',
            type: PUT,
            cache: false,
            dataType: 'json',
            data: {ocena:ocena},
            success:function (res){
                $('#prosecna').empty();    
                $('#prosecna').append("Prosecna ocena:"+ pesma.prosecnaOcena);    
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert(textStatus);
            }
        });
    },showSongList: function () {
        $.ajax({
            url: this.basePath() + '/',
            cache: false,
            dataType: 'json',
            success: function(list){
                $('#songs').empty();
                $.each(list, function (index, professor) {
                    $("#songs").append('<li><a href="pesma.html?id=' + index + '" target="_blank">' + professor.title + "</a><br/></li>");
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {  
                alert("nigs");
            }   
        });
    },
}
$(document).ready(function () {
    // pre-populate the drop down lists of schools
    SongManager.loadSongs();
    SongManager.showSongList();
    // attach event handlers to buttons
    
});
