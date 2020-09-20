const express = require("express");
const http = require("http");
const cors = require("cors");
const shortHash = require("short-hash");
const bodyParser = require("body-parser");
const Firestore = require("@google-cloud/firestore");

// constants
const PRODUCTION = false;
var VERIFY_MSG =
  "Bitte bestätige über diesen Link deine Handynummer für das Laufgelage: https://charlottepradel.de/verifymobile/";

const USER_SECRET = process.env.USER_SECRET;
const PWD = process.env.ADMIN_SECRET;
const port = process.env.PORT;

// constants for twilio
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require("twilio")(accountSid, authToken);
console.log("using sid and token: ", accountSid, authToken);

// database
const FDB = new Firestore({
  keyFilename: "secrets/gaengefuercharly-db-key.json",
});
let ANGELS = FDB.collection("angels");

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
const insertIfNew = async (data) => {
  // see if doc with id exists in Angels
  let docRef = ANGELS.doc(data.last);
  try {
    let docPrev = await docRef.get();
    if (docPrev.exists) {
      console.log("entry with id exists: ", data.last);
      console.log(docPrev.data());
      if (docPrev.data().isTeam) {
        console.log("aborting because team is already set.");
        return false;
      }
    }
    // insert new data with ID
    await docRef.set(data);
    console.log("INSERTED NEW ENTRY: \n\n", data);
    return true;
  } catch (err) {
    console.log("firestore error on isValidPlace", err);
    return false;
  }
};

const sendSMS = (mobile, msg_body) => {
  console.log("Sending SMS to ", mobile);
  if (PRODUCTION) {
    client.messages
      .create({
        body: msg_body,
        from: "+18443114577",
        to: mobile,
      })
      .then((message) => console.log(message.sid));
  }
};

const searchAndVerify = async (userCode) => {
  // find and verify
  var docRef = ANGELS.where("code", "==", userCode);
  try {
    var snapshot = await docRef.get();
    if (snapshot.empty) {
      console.log("code doesnt exist", userCode);
      return false;
    } else {
      snapshot.forEach(async (doc) => {
        console.log(doc.id, "=>", doc.data());
        await ANGELS.doc(doc.id).update({ isVerified: true });
      });
      return true;
    }
  } catch (err) {
    console.log("Error verifying code", err);
    return false;
  }
};

// -----------------------------------------
// -----------------routes -----------------
// -----------------------------------------

app.get("/", (req, res) => {
  res.send(welcomeMessage).status(200);
});

app.post("/register", async (req, res) => {
  var data = req.body;

  welcomeMessage = data;
  console.log("/register: \n", data);

  // validate user secret (shared over whatsapp)
  if (data.userSecret !== USER_SECRET) {
    res.send({ validSecret: false }).status(200);
    console.log("invalid user secret! ", data.userSecret, USER_SECRET);
    return;
  }

  var isNew = true;
  var teamID = null;
  // team or single registration
  if (data.isTeam) {
    // create a teamID from first names (alphabetically)
    var part1 = data.person1.first.substring(0, 3);
    var part2 = data.person2.first.substring(0, 3);
    teamID = part1 < part2 ? part1 + part2 : part2 + part1;

    // create entry for person2
    var p2_code = shortHash(data.person2.last);
    var person2 = {
      ...data.person2,
      code: p2_code,
      isTeam: true,
      teamId: teamID,
      kitchen: data.kitchen,
      isVerified: false,
    };
    if (data.kitchen) {
      person2["address"] = data.address;
    }

    // insert person2 if new or no teamId set
    isNew = await insertIfNew(person2);
  }

  // construct entry for person1
  var p1_code = shortHash(data.person1.last);
  var person1 = {
    ...data.person1,
    code: p1_code,
    isTeam: data.isTeam,
    kitchen: data.kitchen,
    isVerified: false,
  };
  if (data.kitchen) {
    person1["address"] = data.address;
  }
  if (data.isTeam) {
    person1["teamId"] = teamID;
  }

  // insert person1
  isNew = (await insertIfNew(person1)) && isNew;
  res.send({ isNew: isNew, validSecret: true }).status(200);

  // send confirmation link via twilio
  if (isNew) {
    if (data.isTeam) {
      sendSMS(person2.mobil, VERIFY_MSG + person2.code);
    }
    sendSMS(person1.mobil, VERIFY_MSG + person1.code);
  }
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
  var userCode = req.body.verifyCode;
  console.log("received hash: ", userCode);

  // searches the code in database and sets a verified flag if found
  var verified = await searchAndVerify(userCode);
  res.send({ isVerified: verified });
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
