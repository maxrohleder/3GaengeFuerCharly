const express = require("express");
const http = require("http");
const cors = require("cors");
const shortHash = require("short-hash");
const bodyParser = require("body-parser");
const Firestore = require("@google-cloud/firestore");
const { strict } = require("assert");

// constants
const PRODUCTION = true; // prevents sending sms and uses localhost
var VERIFY_MSG =
  "Bitte bestätige über diesen Link deine Handynummer für das Laufgelage: https://charlottepradel.de/verifymobile/";

const USER_SECRET = process.env.USER_SECRET;
const port = process.env.PORT;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

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
  if (PRODUCTION) {
    console.log("Sending SMS to " + mobile + "\n\t" + msg_body);
    client.messages
      .create({
        body: msg_body,
        from: "+18443114577",
        to: mobile,
      })
      .then((message) => console.log(message.sid));
  } else {
    console.log("debug sent: " + msg_body);
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

// create new databases depending on the courses
// KEY = teamId, ring: last_1 & last_2, address, guests
const splitCourses = async () => {
  var angleDoc = ANGELS;
  try {
    var snapshot = await angleDoc.get();
    if (snapshot.empty) {
      console.log("no entries in Angels");
      return 0;
    }
    // walk through whole database
    // split persons depending on their course in 3 sub-databases
    // per sub-database: 1 teamId
    await snapshot.forEach(async (person) => {
      // choose new database depending on course
      var course = person.data().course;

      if (course === "" || course === undefined) {
        console.log("invalid course: " + person.id);
      } else {
        // check if new database already has the teamId as an key entry
        let teamId = person.data().teamId;
        let docRef = FDB.collection(course).doc(teamId);
        try {
          let docPrev = await docRef.get();
          // no entry in database with teamId of this person
          if (!docPrev.exists) {
            // create new document in database
            var newTeam = {
              teamId: teamId,
              address: person.data().address,
              ring: person.data().last,
              guests: person.data().guests,
            };
            await docRef.set(newTeam);
          } else {
            console.log(
              "teamId exists. updating ring with: ",
              person.data().last
            );
            // entry exists in database -> only add the last name of the second person
            var new_ring = docPrev.data().ring + ", " + person.data().last;
            console.log(new_ring);
            await FDB.collection(course).doc(teamId).update({ ring: new_ring });
          }
        } catch (err) {
          console.log("error in async function forEach ", err);
        }
      }
    });
    return 1;
  } catch (err) {
    console.log("error split courses", err);
    return 0;
  }
};

const SendMissionToTeam = async (teamId, addr, ring) => {
  // send an sms to all members of team
  var teamRef = ANGELS.where("teamId", "==", teamId);
  try {
    var teamSnapshot = await teamRef.get();
    if (teamSnapshot.empty) {
      console.log("found no guest");
    }

    teamSnapshot.forEach((personDoc) => {
      var msg =
        "Hallo " +
        personDoc.data().first +
        "! Neue Mission: " +
        addr.street +
        " " +
        addr.number +
        ". Klingel bei " +
        ring;
      var mobile = personDoc.data().mobil;
      sendSMS(mobile, msg);
    }); // find mobil number of guest and send sms
  } catch (err) {
    console.log("error sending mission to team " + teamId + err);
  }
};

// search for course
// inform all guests that they should come to their hosts address
const sendMission = async (course) => {
  var msg;
  var numSMS = 0;
  // course = Flunkyball -> no database needet exept angles to send a message to all participants
  if (course === "Flunkyball") {
    // exeption
    msg =
      "Sonderauftrag: Begebe dich sofort zum Bohlenplatz. Bring ein GESCHLOSSENES Bier mit!";
    var docRef = ANGELS;
    try {
      var snapshot = await docRef.get();
      if (snapshot.empty) {
        console.log("no angles found");
        return 0;
      }
      await snapshot.forEach(async (person) => {
        sendSMS(person.data().mobil, msg);
        numSMS += 1;
      });
      return numSMS;
    } catch (err) {
      console.log("error sending flunky");
      return 0;
    }
  }

  // course = Flunkyball -> no database needet exept angles to send a message to all participants
  if (course === "Afterparty") {
    // exeption
    msg =
      "Danke für deine Teilnahme! Deine letzte Mission für heute: Komme zum El Leon!";
    var docRef = ANGELS;
    try {
      var snapshot = await docRef.get();
      if (snapshot.empty) {
        console.log("no angles found");
        return 0;
      }
      await snapshot.forEach(async (person) => {
        sendSMS(person.data().mobil, msg);
      });
      return numSMS;
    } catch (err) {
      console.log("error sending afterparty");
      return 0;
    }
  }
  if (
    !(
      course !== "Vorspeise" ||
      course !== "Hauptspeise" ||
      course !== "Dessert"
    )
  ) {
    console.log("invalid course");
    return 0;
  } else {
    var docRef = FDB.collection(course);
    try {
      var snapshot = await docRef.get();
      if (snapshot.empty) {
        console.log("no angles found");
        return 0;
      }
      await snapshot.forEach(async (doc) => {
        var hostAddress = doc.data().address;
        var ring = doc.data().ring;
        // search for all guests -> send guests an SMS with their host's address
        for (var prop in doc.data().guests) {
          await SendMissionToTeam(doc.data().guests[prop], hostAddress, ring);
          numSMS += 1;
        }
      });
      return numSMS;
    } catch (err) {
      console.log("error sending mission");
      return 0;
    }
  }
};

const retrieveAllergiesFor = async (teamName) => {
  // console.log("retrieving allergies for: ", teamName);
  var docRef = ANGELS.where("teamId", "==", teamName);
  try {
    var docPrev = await docRef.get();
    var allergies = "";
    // this case should never happen
    if (docPrev.empty) {
      console.log("ALERT No such teamId", teamName);
      return "";
    }

    // append allergies of team Member followed by comma
    docPrev.forEach((doc) => {
      if (doc.data().allergy !== "") {
        allergies += doc.data().allergy + ", ";
      }
    });

    return allergies;
  } catch (err) {
    console.log("error retrieving allergies ", err);
  }
};

// send courses and allergies of guests
const inform = async () => {
  var docRef = ANGELS;
  var numberSms = 0;
  try {
    var snapshot = await docRef.get();
    if (snapshot.empty) {
      console.log("Course does not exist - typo", course);
      return 0;
    }

    // look at all participants which have a course set
    await snapshot.forEach(async (doc) => {
      if (doc.data().course !== undefined) {
        // preparing message for person1
        var msg = "Hallo " + doc.data().first + "! Dein Gang ist: ";
        msg += doc.data().course + "!";

        var allergies = "";
        var teamConstellation =
          doc.id +
          " (" +
          doc.data().teamId +
          ", " +
          doc.data().course +
          ") --> ";
        for (var prop in doc.data().guests) {
          var teamName = doc.data().guests[prop];
          teamConstellation += doc.data().guests[prop] + " ";
          allergies += await retrieveAllergiesFor(teamName);
        }
        console.log(teamConstellation);

        if (allergies !== "") {
          msg += " Beachte diese Allergien: " + allergies;
        }
        if (doc.data().isVerified) {
          sendSMS(doc.data().mobil, msg);
        } else {
          console.log("ERROR not verified: ", doc.id);
        }

        numberSms += 1;
      }
    });
    return numberSms;
  } catch (err) {
    console.log("Error send mission", err);
    return 0;
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

// confirm the mobil number of the participant and set the variable isVerified = true
app.post("/confirm", async (req, res) => {
  var userCode = req.body.verifyCode;
  console.log("received hash: ", userCode);

  // searches the code in database and sets a verified flag if found
  var verified = await searchAndVerify(userCode);
  res.send({ isVerified: verified });
});

// tell teams to which address they should go next
app.post("/mission", async (req, res) => {
  var data = req.body;
  // validate admin secret
  if (data.adminSecret !== ADMIN_SECRET) {
    res.send({ validSecret: false }).status(200);
    console.log("invalid admin secret! ", data.userSecret, ADMIN_SECRET);
    return;
  }
  var numSMS = await sendMission(data.course);
  console.log("I sent " + numSMS + " SMS");
  res.send({ validSecret: true }).status(200);
});

// inform teams about their courses and the allergies of their guests
app.post("/inform", async (req, res) => {
  var data = req.body;

  // validate admin secret
  if (data.adminSecret !== ADMIN_SECRET) {
    res.send({ validSecret: false }).status(200);
    console.log("[/inform] invalid secret ", data.adminSecret, ADMIN_SECRET);
    return;
  }

  // send the inital sms as listed in the db
  var numSms = await inform();
  console.log("I sent " + numSms + " SMS");
  res.send({ validSecret: true, numSMS: numSms }).status(200);
});

// split angel database into 3 groups depending on their course
app.post("/split", async (req, res) => {
  var data = req.body;

  // validate admin secret
  if (data.adminSecret !== ADMIN_SECRET) {
    res.send({ validSecret: false }).status(200);
    console.log("[/inform] invalid secret ", data.adminSecret, ADMIN_SECRET);
    return;
  }

  var spliting = await splitCourses();
  console.log("Finished: ", spliting);
  res.send({ validSecret: true }).status(200);
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
