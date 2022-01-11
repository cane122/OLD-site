var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// kreiramo novu shemu
var songDetailsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    year: {
      type: Number,
      required: true,
    },
    createdAt: Date,
    updatedAt: Date,
    genre: [String],
    youtubeUrl: {
      type: String,
      required: true,
    },
    singerOrGroup: String,
    coverImage: String,
    comments: {
      type: Array,
      required: true,
      items: [
        {
          properties: {
            id: {
             type: Number,
             required: true,
            },
            autor: {
              type: String,
              required: true,
            },
            title: String,
            tekst: String,
            likes: Number,
            dislikes: Number,
            replies: {
              type: Array,
              items: [
                {
                  properties: {
                    id: {
                      type: Number,
                      required: true
                    },
                    ime: String,
                    title: String,
                    tekst: String,
                    likes: Number,
                    dislikes: Number,
                  },
                },
              ],
            },
          },
        },
      ],
    },
    ocene: {
      type: Array,
      required: true,
      items: [
        {
          properties: {
            ocena: Number,
          },
        },
      ],
    },
    ocena: Number,
    izvodjac: {
      type: String,
      required: true,
    },
    datum: Date,
  },
  { collection: "mySongs" }
);

// prilikom snimanja se postavi datum
songDetailsSchema.pre("save", function (next) {
  // preuzmemo trenutni datum
  var currentDate = new Date();

  // postavimo trenutni datum poslednju izmenu
  this.updatedAt = currentDate;

  // ako nije postavljena vrednost za createdAt, postavimo je
  if (!this.createdAt) this.createdAt = currentDate;

  // predjemo na sledecu funkciju u lancu
  next();
});

// od sheme kreiramo model koji cemo koristiti
var MovieDetails = mongoose.model("songs", songDetailsSchema);

// publikujemo kreirani model
module.exports = MovieDetails;
