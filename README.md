# 3GaengeFuerCharly

Implementation of a Webapp, which lets participants register themselves and a backend service which will notify them where to go for their next course at the desired time.

In Contrast to the actual Laufgelage, the participants will not get to know their full schedule for the evening, but will rather receive the updates via SMS in RealTime.

Visit the live version [here](https://charlottepradel.de)

## Technologies

We will use ReactJs to design the frontend logic and custom css for the design. The App will be deployed on firebase.

The backend will be powered by [Nodejs v12](https://github.com/nodejs/node), which allows us to schedule [cronjobs](https://www.npmjs.com/package/cron) to send out sms via [twilio](https://www.npmjs.com/package/twilio) at the desired timepoint. The backend service will be hosted on [Googles App Engine](https://cloud.google.com/appengine/docs).

Alternatively the backend could be powered by python using flask. An alternative to cron jobs can be found in this [article](https://medium.com/thetiltblog/creating-scheduled-functions-in-python-apps-400ecea05bc3)

## Enrollment process

- Fill out form at frontend
- Frontend performs basic validation
- Backend receives data, checks existance with database
- If new, send confirmation sms with confirmation link

## Frontend-Backend-Interface

The following routes define the Api interface between frontend and backend logic.

> Used to register a new patient into the db. if new, returns conformation
>
> HTTP-POST: _/register_ > <br>JSON-PAYLOAD:

```js
{
  "person1": {
        "first": string,
        "last": string,
        "mobile": integer,
        "allergy": string,
        "afterparty": bool,
  },
  "isTeam": bool,
  "person2": {
        "first": string,
        "last": string,
        "mobile": integer,
        "allergy": string,
        "afterparty": bool,
  },
  "kitchen": bool,
  "address": {
        "street": string,
        "number": integer,
        "postal": integer,
  },
  "covid": bool,
}
```

> {
> <br> ANSWER: 200 OK
> <br>JSON-PAYLOAD:

```js
{
    "isNew": bool,
    "validSecret": bool,
}
```

> Used to confirm mobile number.
>
> HTTP-POST: _/confirm_

> <br> ANSWER: 200 OK
> <br>JSON-PAYLOAD:

```js
{
    "verifyCode": string,
}
```

> {
> <br> ANSWER: 200 OK
> <br>JSON-PAYLOAD:

```js
{
    "isVerified": bool,
}
```


> Used to inform participants about their course and their guest's allergies
>
> HTTP-POST: _/inform_

> <br> ANSWER: 200 OK
> <br>JSON-PAYLOAD:

```js
{
    "adminSecret": string,
}
```

> {
> <br> ANSWER: 200 OK
> <br>JSON-PAYLOAD:


> Used to send to next mission
>
> HTTP-POST: _/mission_

> <br> ANSWER: 200 OK
> <br>JSON-PAYLOAD:

```js
{
    "adminSecret": string,
    "mission": string,
}
```

> {
> <br> ANSWER: 200 OK
> <br>JSON-PAYLOAD:

```js
{
    "numSMS": int,
}
```
> **Mission:**
> + starter
> + flunky
> + main
> + dessert
> + bar