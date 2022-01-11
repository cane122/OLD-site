var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// koristimo mongoose model koju smo kreirali u folderu model
var SongDetails = require("./model/songDetails");
// Connection URL
var url = "mongodb://localhost:27017/video";
mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use((req,res,next)=>{
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', ['GET,PUT,POST,DELETE']);
  res.append('Access-Control-Allow-Headers', ['Content-Type']);
  next();
});
// konfigurisemo bodyParser()
// da bismo mogli da preuzimamo podatke iz POST zahteva
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

var port = 5000; // na kom portu slusa server

// ruter za songDetails
var songDetailsRouter = express.Router(); // koristimo express Router

// definisanje ruta za songDetails
songDetailsRouter
  .get("/:id", function (req, res, next) {
    SongDetails.findOne({
      _id: req.params.id,
    }).exec(function (err, entry) {
      // ako se desila greska predjemo na sledeci middleware (za rukovanje greskama)
      if (err) next(err);
      res.json(entry);
    });
  })
  .get("/", function (req, res) {
    SongDetails.find({}, function (err, data, next) {
      res.json(data);
    });
  })
  .post("/", function (req, res, next) {
    var songDetails = new SongDetails(req.body);
    songDetails.save(function (err, entry) {
      if (err) next(err);

      res.json(entry);
    });
  })
  .put("/:id", function (req, res, next) {
    SongDetails.findById(
      {
        _id: req.params.id,
      },function (err, songDetails) {
        if (err) next(err);
        songDetails.set(req.body);
        songDetails.save(function (err, entry) {
          if (err) next(err);
          res.json(entry);
        });
      }
    );
  })
  .put("/komentar/:id", function (req, res, next) {
    SongDetails.findOne(
      {
        _id: req.params.id,
      },
      function (err, songDetails) {
        if (err) next(err);
        if (songDetails.comments.length == undefined){
          songDetails.comments = [req.body];
        }else{
        songDetails.comments.push(req.body);
      }
      songDetails.comments[songDetails.comments.length-1].likes = 0;
      songDetails.comments[songDetails.comments.length-1].dislikes = 0;
      req.body._idk = mongoose.Types.ObjectId();
        songDetails.save(function (err, entry) {
          if (err) next(err);
          res.json(entry);
        });
      }
    );
  })
  .put("/:id/oceni", function (req, res, next) {
    SongDetails.findOne(
      {
        _id: req.params.id,
      },
      (err, songDetails) => {
        if (err) next(err);
        let broj = req.body["ocena"];
        broj = Number(broj);
        console.log(typeof broj + " " + typeof songDetails.ocene.length);
        
        if (songDetails.comments.length == undefined || songDetails.comments.length == 0) {
          console.log("cao")
          songDetails.ocene = [broj];
          songDetails.ocena = broj;
        } else {
          Object.size = function (obj) {
            var size = 0,
              key;
            for (key in obj) {
              if (obj.hasOwnProperty(key)) size++;
            }
            return size;
          };
          // Get the size of an object
          var size = Object.size(songDetails.ocene);
          console.log( (size * songDetails.ocena + broj) / (size + 1))
          songDetails.ocena = (size * songDetails.ocena + broj) / (size + 1);
          songDetails.ocene.push(broj);
        }
        songDetails.save((err, entry) => {
          if (err) next(err);
          res.json(entry);
        });
      }
    );
  })
  .put("/:songid/reply/:commentid", function (req, res, next) {
    SongDetails.findOne(
      {
        _id: req.params.songid,
      },
      (err, songDetails) => {
        if (err) next(err);
        req.body._idr =mongoose.Types.ObjectId();
        if(typeof songDetails.comments.find(x => x._idk == req.params.commentid)==='undefined'){
          res.status(404).json({error:"komentar nije nadjen"});
          return;
        }else{
          
        if(typeof songDetails.comments.find(x => x._idk == req.params.commentid).replies  == 'undefined'){ 
          songDetails.comments.find(x => x._idk == req.params.commentid).replies=[req.body];
          
          
        }else{
           songDetails.comments.find(x => x._idk == req.params.commentid).replies.push(req.body); 
        }
      }
      songDetails.comments[songDetails.comments.length-1].replies[songDetails.comments[songDetails.comments.length-1].replies.length-1].likes = 0;
      songDetails.comments[songDetails.comments.length-1].replies[songDetails.comments[songDetails.comments.length-1].replies.length-1].dislikes = 0;

      songDetails.markModified("comments");
      songDetails.save((err, entry) => {
        if (err) next(err);
        res.json(entry);
      });
    
      }
    );
  })
  .put("/:songid/opinion/:commentid", function (req, res, next) {
    SongDetails.findOne(
      {
        _id: req.params.songid,
      },
      (err, songDetails) => {
        if (err) next(err);
        if(typeof songDetails.comments.find(x => x._idk == req.params.commentid) ==='undefined'){
          res.status(404).json({error:"komentar nije nadjen"});
          return;
        }
        
        let komentar = songDetails.comments.find(x => x._idk == req.params.commentid);
        if(req.body.opinion==="like"){
          songDetails.comments.find(x => x._idk == req.params.commentid).likes +=1;
        }else if(req.body.opinion==="dislike"){
          songDetails.comments.find(x => x._idk == req.params.commentid).dislikes +=1;
        }else if(req.body.opinion==="-like"){
          songDetails.comments.find(x => x._idk == req.params.commentid).likes -=1;
        }else if(req.body.opinion==="-dislike"){
          songDetails.comments.find(x => x._idk == req.params.commentid).dislikes -=1;
        }else { 
          next(err);
          return;
        }
        songDetails.save(function (err, entry) {
          if (err) next(err);
          res.json(entry);
        });         
      }
    );
  })
  .put("/:songid/komentar/:commentid/opinion/:replyid", function (req, res, next) {
    SongDetails.findOne(
      {
        _id: req.params.songid,
      },
      (err, songDetails) => {
        if (err) next(err);
        if(typeof songDetails.comments.find(x => x._idk == req.params.commentid) ==='undefined'){
          res.status(404).json({error:"komentar nije nadjen"});
          return;
        }
        let komentar = songDetails.comments.find(x => x._idk == req.params.commentid);
        if(typeof komentar.replies.find(x => x._idr == req.params.replyid) ==='undefined'){
          res.status(404).json({error:"reply nije nadjen"});
          return;
        }
        
        let reply = komentar.replies;
        if(req.body.opinion==="like"){
          songDetails.comments.find(x => x._idk == req.params.commentid).replies.find(x => x._idr == req.params.replyid).likes +=1;
        }else if(req.body.opinion==="dislike"){
          songDetails.comments.find(x => x._idk == req.params.commentid).replies.find(x => x._idr == req.params.replyid).dislikes +=1;
        }else if(req.body.opinion==="-like"){
          songDetails.comments.find(x => x._idk == req.params.commentid).replies.find(x => x._idr == req.params.replyid).likes -=1;
        }else if(req.body.opinion==="-dislike"){
          songDetails.comments.find(x => x._idk == req.params.commentid).replies.find(x => x._idr == req.params.replyid).dislikes -=1;
        }else { 
          next(err);
          return;
        }
        songDetails.save(function (err, entry) {
          if (err) next(err);
          res.json(entry);
        });         
      }
    );
  })
  .delete("/:id", function (req, res, next) {
    SongDetails.findOneAndRemove(
      {
        _id: req.params.id,
      },
      function (err, movie, successIndicator) {
        if (err) next(err);
        res.json(successIndicator);
      }
    );
  }).put('/:id/sortLike', function(req, res, next) {
    SongDetails.findOne({
        "_id": req.params.id
        }, function(err, songDetails) {
            if (err) next(err);
            var i = 0;
            var j = 0;
                while(i < songDetails.comments.length){
                    j = 0;
                    while(j < i){
                        if(songDetails.comments[j].likes < songDetails.comments[i].likes){
                      
                            var temp = songDetails.comments[j];
                            songDetails.comments[j] = songDetails.comments[i];
                            songDetails.comments[i] = temp;
                        }
                        ++j;
                    }
                    ++i;
                }

        res.json(songDetails);
    });
});
  

// dodavanje rutera zu songDetails /api/songDetails
app.use("/api/songDetails", songDetailsRouter);

//na kraju dodajemo middleware za obradu gresaka
app.use(function (err, req, res, next) {
  var message = err.message;
  var error = err.error || err;
  var status = err.status || 500;

  res.status(status).json({
    message: message,
    error: error,
  });
});

// Pokretanje servera
app.listen(port);

console.log("Server radi na portu " + port);
