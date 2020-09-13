const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");

// constants
const PRODUCTION = false;
let port;
if (PRODUCTION) {
  port = process.env.PORT;
} else {
  port = 8080;
}

// creating the http and socket server
const app = express();
app.use(cors());
app.use(express.json()); // for post calls in json format
const server = http.createServer(app);
app.use(bodyParser.json()); // to decode payloads in json

// define all routes
app.get("/", (req, res) => {
  res.send("Ahoy from Charly").status(200);
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  res.send({ isNew: true }).status(200);
});

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
