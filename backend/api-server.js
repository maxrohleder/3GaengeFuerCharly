const express = require("express");
const http = require("http");
const cors = require("cors");
const shortHash = require("short-hash");
const bodyParser = require("body-parser");
const Firestore = require("@google-cloud/firestore");

// constants
const PRODUCTION = false;
const COLLECTION_NAME = "angels";

const USER_SECRET = process.env.USER_SECRET;
const PWD = process.env.ADMIN_SECRET;
const port = process.env.PORT;
// constants for twilio
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken)

// database
const FDB = new Firestore({
  keyFilename: "secrets/gaengefuercharly-db-key.json",
});

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
insertIfNew = (data) => {
  // TODO insert new data with ID
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
  console.log("/register: \n", req.body);

  // validate user secret (shared over whatsapp)
  if (req.body.data.userSecret !== USER_SECRET) {
    res.send({ validSecret: false }).status(200);
    return;
  }

  var data = req.body;
  var isNew = true;
  // team or single registration
  if (req.body.isTeam) {
    // create a teamID from first names (alphabetically)
    var part1 = req.body.person1.first.substring(0, 3);
    var part2 = req.body.person2.first.substring(0, 3);
    var teamID = part1 < part2 ? part1 + part2 : part2 + part1;

    // create entry for person2
    var person2 = {
      ...data.person2,
      isTeam: true,
      teamId: teamID,
      kitchen: [data.kitchen],
      isVerified: false,
    };
    if (data.kitchen) {
      person2["address"] = data.address;
    }

    // insert person2 if new or no teamId set
    isNew = insertIfNew(person1);
  }

  // insert person2
  isNew = insertSingleIfNew(req.body.data) && isNew;
  res.send({ isNew: isNew }).status(200);

  // TODO send passkey via twilio
  // TODO generate validation link
  var link = None;
  var user_mobil = None;
  var msg_body = 'Bitte bestätige über diesen Link deine Handynummer für das Laufgelage: ' + link;
  client.messages
    .create({
      body: msg_body,
      from: '+18443114577',
      to: user_mobil,
    })
    .then(message => console.log(message.sid))
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

app.post("/confirm", async (req, res) => {
  console.log("received hash: ", userCode);
  var userCode = req.body.verifyCode;
  // searches the code in database and sets a verified flag if found
  var verified = searchAndVerify(userCode);
  res.send({ isVerified: true });
  console.log("received code: ", userCode);
  console.log("valid");
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
