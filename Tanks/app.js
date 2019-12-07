const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(express.static(path.join(__dirname, "/src")));

let jason = null;

app.post("/", function(req, res) {
  //console.log(req.body.qtable);

  //const fs = require("./src/qtable.json");
  try {
    fs.writeFileSync("./src/qtable.json", req.body.qtable);
    console.error("save success");
  } catch (err) {
    console.error("error");
  }
});

fs.readFile("./src/qtable.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file from disk:", err);
    return;
  }
  try {
    //jason = JSON.parse(jsonString);
    //console.log(jason);
    app.get("/", function(req, res) {
      //console.log(jsonString)
      res.render("index", { "jason": jsonString });
      //ai.loadQtableFromJSON(jason); // front-end ke func ko backend se nai call kar sakta
    });
    console.error("load success");
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});

app.listen(3000);
