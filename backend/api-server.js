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
const FDB = new Firestore({
  projectId: "<project-name>",
  keyFilename: "secrets/<auth-key-firestore>.json",
});

// variables
var welcomeMessage = "Ahoy there!";

// creating the http and socket server
const app = express();
app.use(cors());
app.use(express.json()); // for post calls in json format
const server = http.createServer(app);
app.use(bodyParser.json()); // to decode payloads in json

// helper methods

// -----------------------------------------
// -----------------routes -----------------
// -----------------------------------------

app.get("/", (req, res) => {
  res.send(welcomeMessage).status(200);
});

app.post("/register", async (req, res) => {
  welcomeMessage = req.body;
  console.log(req.body);

  // assert none of the persons are in teams already

  // assert person does not exist without teamID already

  // generate TeamID

  // insert person1 with TeamID

  res.send({ isNew: true }).status(200);

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

// -----------------------------------------
// -----------------routes -----------------
// -----------------------------------------

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
