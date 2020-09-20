import React, { Component } from 'react';
import './App.css';
import logo from './pageHead.png'

const API_URL = 'https://gaengefuercharly.ew.r.appspot.com/register';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      websiteNr: 0,
      userSecret: '',
      p1_first: '',
      p1_last: '',
      p1_mobil: '',
      p1_allergy: '',
      p1_afterparty: '',
      isTeam: false,
      p2_first: '',
      p2_last: '',
      p2_mobile: '',
      p2_allergy: '',
      p2_afterparty: '',
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
      userSecret: this.userSecret,
      person1: {
        first: this.state.p1_first,
        last: this.state.p1_last,
        mobil: this.state.p1_mobil,
        allergy: this.state.p1_allergy,
        afterparty: this.p1_afterparty,
      },
      isTeam: this.state.isTeam,
      person2: {
        first: this.state.p2_first,
        last: this.state.p2_last,
        mobil: this.state.p2_mobil,
        allergy: this.state.p2_allergy,
        afterparty: this.p1_afterparty
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
        userSecret: data.userSecret,
      })
      if (data.userSecret) {
        if (data.isNew) {
          // registration form is valid and password is correct
          this.setState({ websiteNr: 5 })
        }
        else {
          // registration form is invalid - user already exists
          this.setState({ websiteNr: 4 })
        }
      }
      else {
        // invalid user secret
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
          <td><input type='text' name='p2_first' minLength='3' onChange={this.onChangeHandler} required></input></td>
        </tr>
        <tr>
          <td>Nachname</td>
          <td><input type='text' name='p2_last' onChange={this.onChangeHandler} required></input></td>
        </tr>
        <tr>
          <td>Handynummer (+49...)</td>
          <td><input type='number' name='p2_mobil' placeholder='+49123' onChange={this.onChangeHandler} required></input></td>
        </tr>
        <tr>
          <td>Unverträglichkeiten/<br></br>Einschränkungen</td>
          <td><input type='text' name='p2_allergy' onChange={this.onChangeHandler}></input></td>
        </tr>
        <tr>
          <td colspan='2'><input type='checkbox' name='p2_afterparty' onChange={this.onButtonChange}></input> Ich bin bei ner Afterparty dabei</td>
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
    // welcome page
    if (this.state.websiteNr === 0) {
      return (
        <div className='welcomePage'>
          <div className='pageHeader'>
            <img src={logo} alt='Logo' width='100%' />
          </div>
          <div className='welcome'>
            <p>Hallo meine Engel!<br></br><br></br>
          Herzlich Willkommen auf der Anmeldeseite für das interne Laufgelage anlässlich meines Geburtstages. Es freut mich sehr, das ihr den Weg zu mir gefunden habt. <br></br><br></br>
          Kurz zum Ablauf:<br></br>
          Ihr werdet in 2er Teams aufgeteilt (wer einen favorisierten Partner hat, kann sich gerne mit diesem zusammen anmelden). Jedes Team erhält einen von 3 Gängen (Vor-, Haupt- oder Nachspeise), welchen es für 4 weitere Gäste vorbereiten soll. Für die anderen beiden Gänge besucht man einen jeweils anderen Haushalt. So lernt jedes Team an dem Abend vorraussichtlich 6 andere Teams kennen. Wer aufgrund der aktuellen Corona-Situation keine/wenig neue Menschen kennenlernen möchte, kann dies in der Anmeldung angeben. Dann werde ich versuchen euch nur mit euch bekannten Personen in eine Gruppe zu stecken.<br></br>
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
    // registration form
    if (this.state.websiteNr === 1) {
      return (
        <div className='welcomePage'>
          <div className='pageHeader'>
            <img src={logo} alt='Logo' width='100%' />
          </div>
          <div className='RegisterFormCard'>
            <div className='header'>Anmeldung</div>
            <form onSubmit={this.sendRegisterform}>
              <table>
                <tr>
                  <th>Engel Nr. 1</th>
                </tr>
                <tr>
                  <td>Passwort</td>
                  <td><input type='password' name='userSecret' onChange={this.onChangeHandler} required></input></td>
                </tr>
                <tr>
                  <td>Vorname</td>
                  <td><input type='text' name='p1_first' minLength='3' onChange={this.onChangeHandler} required></input></td>
                </tr>
                <tr>
                  <td>Nachname</td>
                  <td><input type='text' name='p1_last' onChange={this.onChangeHandler} required></input></td>
                </tr>
                <tr>
                  <td>Handynummer (+49...)</td>
                  <td><input type='number' name='p1_mobil' placeholder='+49123' onChange={this.onChangeHandler} required></input></td>
                </tr>
                <tr>
                  <td>Unverträglichkeiten/<br></br>Einschränkungen</td>
                  <td><input type='text' name='p1_allergy' onChange={this.onChangeHandler}></input></td>
                </tr>
                <tr>
                  <td colspan='2'><input type='checkbox' name='p1_afterparty' onChange={this.onButtonChange}></input> Ich bin bei ner Afterparty dabei</td>
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
    // user entered wrong user secret
    if (this.state.websiteNr === 2) {
      return (
        <div className='welcomePage'>
          <div className='pageHeader'>
            <img src={logo} alt='Logo' width='100%' />
          </div>
          <div className='finished'>
            <h2>Ungültiges Passwort</h2>
            <p>Das von dir eingetragene Passwort entspricht nicht dem in der WhatsApp-Gruppe. Bitte lade diese Seite neu und überprüfe deine Einträge.</p>
          </div>
        </div>
      )
    }
    // error: user already in data base
    if (this.state.websiteNr === 4) {
      return (
        <div className='welcomePage'>
          <div className='pageHeader'>
            <img src={logo} alt='Logo' width='100%' />
          </div>
          <div className='finished'>
            <h2>Registrierung fehlgeschlagen</h2>
            <p>Upps, du bist anscheinend schon in unserer Datenbank eingetragen. Bei Fragen kannst du dich gerne jederzeit an uns wenden.</p>
          </div>
        </div>
      )
    }
    // successful registration - finished page
    if (this.state.websiteNr === 5) {
      return (
        <div className='welcomePage'>
          <div className='pageHeader'>
            <img src={logo} alt='Logo' width='100%' />
          </div>
          <div className='finished'>
            <p>
              Herzlichen Glückwunsch, deine Anmeldung war erfolgreich!<br></br><br></br>
              Du erhälst in Kürze eine Validierungs-SMS, die du (und ggf. auch dein Partner-Engel) bestätigen müssen, damit wir euch jederzeit via SMS erreichen können.<br></br>
              Du erhälst im Laufe der kommenden Woche eine SMS mit dem Namen deines Teampartners, eurem Gang und den Anmerkungen eurer Gäste.<br></br>
              Der erste Gang wird ab <b>18 Uhr</b> serviert. Ihr bekommt kurz zuvor per SMS Bescheid, wohin eure Reise geht.<br></br><br></br>
              Ich freu mich auf dich!</p>
            <div><iframe title='leo says thanks' src="https://giphy.com/embed/g9582DNuQppxC" width="100%" frameBorder="0" className="giphy-embed" allowFullScreen></iframe></div>
            <p style={{ fontSize: '0.1em' }}><a href="https://giphy.com/gifs/hero0fwar-karmawhore-rhyming-g9582DNuQppxC">via GIPHY</a></p>
          </div>
        </div>
      )
    }
  }

}

export default App;
