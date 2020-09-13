# 3GaengeFuerCharly
Implementation of a Webapp, which lets participants register themselves and a backend service which will notify them where to go for their next course at the desired time.

In Contrast to the actual Laufgelage, the participants will not get to know their full schedule for the evening, but will rather receive the updates via SMS in RealTime.

## Technologies

We will use ReactJs to design the frontend logic and custom css for the design. The App will be deployed on firebase.

The backend will be powered by [Nodejs v12](https://github.com/nodejs/node), which allows us to schedule [cronjobs](https://www.npmjs.com/package/cron) to send out sms via [twilio](https://www.npmjs.com/package/twilio) at the desired timepoint. The backend service will be hosted on [Googles App Engine](https://cloud.google.com/appengine/docs).

Alternatively the backend could be powered by python using flask. An alternative to cron jobs can be found in this [article](https://medium.com/thetiltblog/creating-scheduled-functions-in-python-apps-400ecea05bc3)

## Frontend-Backend-Interface

The only time the webapp has to communicate with the backend service is to register a new participant. To to so, the backend shall expose the following route:

> HTTP-POST: */register*
> <br>JSON-PAYLOAD:
``` js
{
  "person1": {
      "first": string,
      "last": string,
      "mobile": integer,       
      "allergy": string,
  }, 
  "isTeam": bool,
  "person2": {
      "first": string,
      "last": string,
      "mobile": integer,       
      "allergy": string,
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
>  {
> <br> ANSWER: 200 OK
> <br>JSON-PAYLOAD:
```js
{
    "isNew": bool,
}
```
