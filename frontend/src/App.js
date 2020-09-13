import React, { Component } from 'react';
import './App.css';

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
    };
  }
  goToRegisterPage = () => {
    this.setState({ websiteNr: 1 }
    );
    console.log('Test Button')
  }
  sendRegisterform = (event) => {
    event.preventDefault();
    this.setState({ websiteNr: 2 })
    console.log('Send info', this.state);
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
        Person 2<br></br>
        <label>Vorname:
          <input type='text' name='p2_first' onChange={this.onChangeHandler}></input>
        </label><br></br>
        <label>Nachname:
          <input type='text' name='p2_last' onChange={this.onChangeHandler}></input>
        </label><br></br>
        <label>Handynummer:
          <input type='text' name='p2_mobil' onChange={this.onChangeHandler}></input>
        </label><br></br>
        <label>Unverträglichkeiten/Einschränkungen:
          <input type='text' name='p2_allergy' onChange={this.onChangeHandler}></input>
        </label><br></br>
      </React.Fragment>
    );
  }
  showKitchenAddress = () => {
    return (
      <React.Fragment>
        <label>Straße:
          <input type='text' name='street' onChange={this.onChangeHandler}></input>
        </label><br></br>
        <label>Hausnummer:
          <input type='text' name='number' onChange={this.onChangeHandler}></input>
        </label><br></br>
        <label>PLZ:
          <input type='text' name='postal' onChange={this.onChangeHandler}></input>
        </label><br></br>
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
              Person 1<br></br>
              <label>Vorname:
                <input type='text' name='p1_first' onChange={this.onChangeHandler}></input>
              </label><br></br>
              <label>Nachname:
                <input type='text' name='p1_last' onChange={this.onChangeHandler}></input>
              </label><br></br>
              <label>Handynummer:
                <input type='text' name='p1_mobil' onChange={this.onChangeHandler}></input>
              </label><br></br>
              <label>Unverträglichkeiten/Einschränkungen:
                <input type='text' name='p1_allergy' onChange={this.onChangeHandler}></input>
              </label><br></br>
              <label>Ich möchte mit einem bestimmten Engel zusammenarbeiten
                <input type='checkbox' name='isTeam' onChange={this.onButtonChange}></input><br></br>
              </label>
              {this.state.isTeam ? this.showPerson2() : null}
              <label>Mir steht eine Küche zur Verfügung
                <input type='checkbox' name='kitchen' onChange={this.onButtonChange}></input><br></br>
              </label>
              {this.state.kitchen ? this.showKitchenAddress() : null}
              <label>Ich möchte nur bekannte Engel treffen
                <input type='checkbox' name='covid' onChange={this.onButtonChange}></input><br></br>
              </label>
              <button type='submit'>Jetzt anmelden</button>
            </form>
          </div>
        </div>
      )
    }
    if (this.state.websiteNr === 2) {
      return (
        <div className='welcomePage'>
          <h1>3 Gänge für Charly</h1>
        </div>
      )
    }

  }

}

export default App;
