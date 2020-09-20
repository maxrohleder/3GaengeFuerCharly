const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const Firestore = require("@google-cloud/firestore");

// constants
const PRODUCTION = false;
const USER_SECRET = process.env.USER_SECRET;
const PWD = process.env.ADMIN_SECRET;
const port = process.env.PORT;

// database
const FDB = new Firestore({
  projectId: "<project-name>",
  keyFilename: "secrets/<auth-key-firestore>.json",
});
const TEAMS = "teams"; // collection names for teams and singles
const SINGLES = "singles";

// variables
var welcomeMessage = "Ahoy there!";

// creating the http and socket server
const app = express();
app.use(cors());
app.use(express.json()); // for post calls in json format
const server = http.createServer(app);
app.use(bodyParser.json()); // to decode payloads in json

////////////////////////////////////////////
////////////////// helpers /////////////////
////////////////////////////////////////////

// inserts the requested data into database if new
insertTeamIfNew = (data, teamID) => {
  // TODO insert new data with ID
  return true;
};

// checks existence and inserts if new
insertSingleIfNew = (data) => {
  // TODO check and insert as single
  return true;
};

// -----------------------------------------
// -----------------routes -----------------
// -----------------------------------------

app.get("/", (req, res) => {
  res.send(welcomeMessage).status(200);
});

app.post("/register", async (req, res) => {
  welcomeMessage = req.body;
  console.log("received: \n", req.body);

  // team or single registration
  if (req.body.isTeam) {
    // create a teamID from first names (alphabetically)
    var part1 = req.body.person1.first.substring(0, 3);
    var part2 = req.body.person2.first.substring(0, 3);
    var teamID = part1 < part2 ? part1 + part2 : part2 + part1;

    // check if teamID exists and insert if new
    var isNew = insertTeamIfNew(req.body.data, teamID);
    res.send({ isNew: isNew, teamID: teamID }).status(200);
  } else {
    // register single person
    var isNew = insertSingleIfNew(req.body.data);
    res.send({ isNew: isNew }).status(200);
  }

  // TODO send passkey via twilio
});

app.post("/participants", async (req, res) => {
  var pwd = req.body.pwd;
  console.log(req.body);
  console.log(pwd);
  if (pwd === PWD) {
    res.send({ auth: true, data: { user: "Max" } }).status(200);
  } else {
    res.send({ auth: false }).status(401);
  }
});

// ##############################################
// ############# start service ##################
// ##############################################

// run the server in either production or dev mode
if (PRODUCTION) {
  server.listen(port, "0.0.0.0", () =>
    console.log(`listening on http://0.0.0.0:` + port)
  );
} else {
  server.listen(port, () =>
    console.log(`listening on http://127.0.0.1:` + port)
  );
}
