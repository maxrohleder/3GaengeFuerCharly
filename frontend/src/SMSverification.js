import React, { Component } from "react";
import "./App.css";
import logo from "./pageHead.png";

const CONFIRM_ROUTE = "https://gaengefuercharly.ew.r.appspot.com/confirm";

class SMSverification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyCode: props.match.params.code,
      websiteNr: 0,
    };
  }

  // start SMS verification
  componentDidMount() {

    console.log('verifying code: ', this.state.verifyCode);
    var payload = JSON.stringify({
      verifyCode: this.state.verifyCode,
    });
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    };
    fetch(CONFIRM_ROUTE, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.isVerified) {
          // user entered valid link - validate mobile number
          this.setState({ websiteNr: 1 });
        } else {
          // invalid link - reject request
          this.setState({ websiteNr: 2 });
        }
      })
      .catch((err) => {
        console.log(
          "Something went wrong during the SMS code verification",
          err
        );
      });
  }

  render() {
    if (this.state.websiteNr === 0) {
      // sending message to backend to validate phone number / link
      return (
        <div className="welcomePage">
          <div className="pageHeader">
            <img src={logo} alt="Logo" width="100%" />
          </div>
          <div className="finished">
            <h2>Warte auf Verifizierung</h2>
            <p>
              Bitte habe kurz Gedult, unsere Datenbank gleicht gerade deine
              Informationen mit dem von dir verwendeten Link ab.
            </p>
          </div>
        </div>
      );
    }
    if (this.state.websiteNr === 1) {
      // backend confirmend send link / phone number
      return (
        <div className="welcomePage">
          <div className="pageHeader">
            <img src={logo} alt="Logo" width="100%" />
          </div>
          <div className="finished">
            <h2>Deine Verifizierung war erfolgreich</h2>
            <p>
              Super, deine Handynummer wurde soeben verifiziert. <br></br>Du bist jetzt
              ein flugbereiter Engel!<br></br>
                Bitte erinnere auch ggf. deinen Partner-Engel daran, seine
                Nummer zu validieren.
            </p>
          </div>
        </div>
      );
    }
    if (this.state.websiteNr === 2) {
      // backend rejected send link / phone number
      return (
        <div className="welcomePage">
          <div className="pageHeader">
            <img src={logo} alt="Logo" width="100%" />
          </div>
          <div className="finished">
            <h2>Verifizierung fehlgeschlagen</h2>
            <p>
              Upps, da ist wohl was schief gegangen...<br></br>Bitte kontaktiere
              uns, wenn du Probleme bei der Registrierung haben solltest.
            </p>
          </div>
        </div>
      );
    }
  }
}

export default SMSverification;
