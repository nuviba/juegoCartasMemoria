//---- Express and Mongo configuration -----
const express = require("express");
const mongodb = require("mongodb");
const app = express();
let MongoClient = mongodb.MongoClient;
//---- END Express and Mongo configuration -----

//----- Express method specification ------
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
//----- END Express method specification ------

//Database name: memoryGame --- Database conection
MongoClient.connect("mongodb://localhost:27017", (err, client) => {
  err
    ? (console.log("❌ MongoDB NO conectado"), console.log(`error ${err}`))
    : ((app.locals.db = client.db("memoryGame")),
      console.log("✅ MongoDB conectado"));
});
// END --- Database conection

//---------- CALLS to API ---------



// Gets all the scores sorted.
app.get("/api/ranking/facil", (req, res) => {
  app.locals.db
    .collection("ranking-facil")
    .find()
    .sort({ score: 1 })
    .toArray(function (err, datos) {
      err
        ? (console.log(err), res.send({ mensaje: "error" + err }))
        : (console.log(datos), res.send({ results: datos }));
    });
});
app.get("/api/ranking/dificil", (req, res) => {
  app.locals.db
    .collection("ranking-dificil")
    .find()
    .sort({ score: 1 })
    .toArray(function (err, datos) {
      err
        ? (console.log(err), res.send({ mensaje: "error" + err }))
        : (console.log(datos), res.send({ results: datos }));
    });
});

//Add score into the db
app.post("/api/addScore/facil", (req, res) => {
  app.locals.db.collection("ranking-facil").insertOne(
    {
      name: req.body.name,
      score: req.body.score,
    },
    (err, datos) => {
      err
        ? (console.log(err), res.send({ mensaje: "error" + err }))
        : (console.log(datos),
          res.send(datos));
    }
  );
});
app.post("/api/addScore/dificil", (req, res) => {
  app.locals.db.collection("ranking-dificil").insertOne(
    {
      name: req.body.name,
      score: req.body.score,
    },
    (err, datos) => {
      err
        ? (console.log(err), res.send({ mensaje: "error" + err }))
        : (console.log(datos),
          res.send(datos));
    }
  );
});

//---------- END CALLS to API ---------

app.listen(process.env.PORT || 3001);
