import React, { Component } from 'react';
import './App.css';

const API_URL = 'https://gaengefuercharly.ew.r.appspot.com/register';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      websiteNr: 1,
      p1_first: '',
      p1_last: '',
      p1_mobil: '',
      p1_allergy: '',
      isTeam: '',
      p2_first: '',
      p2_last: '',
      p2_mobile: '',
      p2_allergy: '',
      kitchen: '',
      street: '',
      number: '',
      postal: '',
      covid: '',
      registerSuccess: false,
    };
  }
  goToRegisterPage = () => {
    this.setState({ websiteNr: 1 }
    );
    console.log('Test Button')
  }
  sendRegisterform = (event) => {
    event.preventDefault();
    var payload = JSON.stringify({
      person1: {
        first: this.state.p1_first,
        last: this.state.p1_last,
        mobil: this.state.p1_mobil,
        allergy: this.state.p1_allergy,
      },
      isTeam: this.state.isTeam,
      person2: {
        first: this.state.p2_first,
        last: this.state.p2_last,
        mobil: this.state.p2_mobil,
        allergy: this.state.p2_allergy,
      },
      kitchen: this.state.kitchen,
      address: {
        street: this.state.street,
        number: this.state.number,
        postal: this.state.postal,
      },
      covid: this.state.covid,
    });
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    }
    fetch(API_URL, requestOptions).then((response) => response.json()).then((data) => {
      console.log(data);
      this.setState({
        registerSuccess: data.isNew,
      })
      if (data.isNew) {
        this.setState({ websiteNr: 2 })
      }
    }).catch((err) => {
      console.log('Something went wrong during the registration', err)
    })
  }
  onChangeHandler = (event) => {
    let key = event.target.name;
    let val = event.target.value;

    this.setState({ [key]: val });
    console.log(key, val)
  }
  onButtonChange = (event) => {
    let key = event.target.name;
    let team = event.target.checked;
    this.setState({ [key]: team });
  }
  showPerson2 = () => {
    return (
      <React.Fragment>
        <tr>
          <th>Engel Nr. 2</th>
        </tr>
        <tr>
          <td>Vorname</td>
          <td><input type='text' name='p2_first' onChange={this.onChangeHandler} required></input></td>
        </tr>
        <tr>
          <td>Nachname</td>
          <td><input type='text' name='p2_last' onChange={this.onChangeHandler} required></input></td>
        </tr>
        <tr>
          <td>Handynummer</td>
          <td><input type='number' name='p2_mobil' onChange={this.onChangeHandler} required></input></td>
        </tr>
        <tr>
          <td>Unverträglichkeiten/<br></br>Einschränkungen</td>
          <td><input type='text' name='p2_allergy' onChange={this.onChangeHandler}></input></td>
        </tr>
      </React.Fragment>
    );
  }
  showKitchenAddress = () => {
    return (
      <React.Fragment>
        <tr>
          <td>Straße</td>
          <td><input type='text' name='street' onChange={this.onChangeHandler} required></input></td>
        </tr>
        <tr>
          <td>Hausnummer</td>
          <td><input type='number' name='number' onChange={this.onChangeHandler} required></input></td>
        </tr>
        <tr>
          <td>PLZ</td>
          <td><input type='number' name='postal' onChange={this.onChangeHandler}></input></td>
        </tr>
      </React.Fragment>
    )
  }

  render() {
    if (this.state.websiteNr === 0) {
      return (
        <div className='welcomePage'>
          <h1>3 Gänge für Charly</h1>
          <div className='welcome'>
            <p>Hallo meine Engel!<br></br><br></br>
          Herzlich Willkommen auf der Anmeldeseite für das interne Laufgelage anlässlich meines Geburtstages. Es freut mich sehr, das ihr den Weg zu mir gefunden habt. <br></br><br></br>
          Kurz zum Ablauf:<br></br>
          Ihr werdet in 2er Teams aufgeteilt (wer einen favorisierten Partner hat, kann sich gerne mit diesem zusammen anmelden). Jedes Team erhält einen von 3 Gängen (Vor-, Haupt- oder Nachspeise), welchen es für 4 Gäste vorbereiten soll. Für die anderen beiden Gänge besucht man einen jeweils anderen Haushalt. So lernt jedes Team an dem Abend vorraussichtlich 6 andere Teams kennen. Wer aufgrund der aktuellen Corona-Situation keine/wenig neue Menschen kennenlernen möchte, kann dies in der Anmeldung angeben. Dann werde ich versuchen euch nur mit euch bekannten Personen in eine Gruppe zu stecken.<br></br>
          Da ein Engel immer dem Anlass entsprechend gekleidet sein sollte, ist alles von schwarzer Hose &amp; Hemd bis zum Abiballkleid erwünscht.<br></br>
          Weil wir auch Engel aus anderen Sektionen erwarten, gebt ihr bitte an, ob euch eine Küche in Erlangen zur Verfügung steht. Andernfalls werde ich euch eine Küche organisieren.<br></br>
          Nach dem Dessert werden wir uns noch alle in einer Bar oder ähnlichem treffen.<br></br>
          Wenn sich alle Engel angemeldet haben und die Teams zusammengesetzt wurden, erhaltet ihr eine SMS von mir, in welcher euer Gang sowie die Unverträglichkeiten eurer Gäste stehen. Am Abend des Laufgelages erhaltet ihr dann immer kurz vor Beginn eurer nächsten Mission die Adresse eures Zielortes.<br></br>
              <br></br>
          Bis dann meine Engel, ich freu mich auf euch.<br></br>
          Eure Charly
        </p>
            <button onClick={this.goToRegisterPage}>Jetzt anmelden</button>
          </div>
        </div>
      )
    }
    if (this.state.websiteNr === 1) {
      return (
        <div className='welcomePage'>
          <h1>3 Gänge für Charly</h1>
          <div className='RegisterFormCard'>
            <div className='header'>Anmeldung</div>
            <form onSubmit={this.sendRegisterform}>
              <table>
                <tr>
                  <th>Engel Nr. 1</th>
                </tr>
                <tr>
                  <td>Vorname</td>
                  <td><input type='text' name='p1_first' onChange={this.onChangeHandler} required></input></td>
                </tr>
                <tr>
                  <td>Nachname</td>
                  <td><input type='text' name='p1_last' onChange={this.onChangeHandler} required></input></td>
                </tr>
                <tr>
                  <td>Handynummer</td>
                  <td><input type='number' name='p1_mobil' onChange={this.onChangeHandler} required></input></td>
                </tr>
                <tr>
                  <td>Unverträglichkeiten/<br></br>Einschränkungen</td>
                  <td><input type='text' name='p1_allergy' onChange={this.onChangeHandler}></input></td>
                </tr>
                <tr>
                  <td colspan='2'><input type='checkbox' name='isTeam' onChange={this.onButtonChange}></input> Ich habe bereits einen Team-Engel</td>
                </tr>
                {this.state.isTeam ? this.showPerson2() : null}
                <tr>
                  <td colspan='2'><input type='checkbox' name='kitchen' onChange={this.onButtonChange}></input> Mir steht eine Küche zur Verfügung</td>
                </tr>
                {this.state.kitchen ? this.showKitchenAddress() : null}
                <tr>
                  <td colspan='2'><input type='checkbox' name='covid' onChange={this.onButtonChange}></input> Ich möchte nur mir bekannte Engel treffen</td>
                </tr>
                <tr>
                  <td colspan='2'><button type='submit'>Jetzt anmelden</button></td>
                </tr>
              </table>
            </form>
          </div>
        </div >
      )
    }
    if (this.state.websiteNr === 2) {
      return (
        <div className='welcomePage'>
          <h1>3 Gänge für Charly</h1>
          <div className='finished'>
            <p>
              Herzlichen Glückwunsch, deine Anmeldung war erfolgreich!<br></br><br></br>
              Du erhälst im Laufe der kommenden Woche eine SMS mit dem Namen deines Teampartners, eurem Gang und den Unverträglichkeiten/Einschränkungen eurer Gäste.<br></br>
              Der erste Gang wird ab 18 Uhr serviert. Ihr bekommt kurz zuvor per SMS Bescheid, wohin eure Reise geht.<br></br><br></br>
              Ich freu mich auf euch!
            </p>
          </div>
        </div>
      )
    }

  }

}

export default App;
