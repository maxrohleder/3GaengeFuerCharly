# Backend service for Charlies Laufgelage

## Database model

This is how a database entry shall look like:

```js
{
  angels: [
    ("Mustermann": {
      first: "Max",
      last: "Mustermann",
      code: "b4f20289",
      isTeam: true,
      teamId: ChaMax,
      kitchen: true,
      address: {
        street: "Musterstreet",
        number: 123,
        postal: 91052,
      },
      mobile: 015123533048,
      covid: false,
      allergy: "",
      afterparty: true,
      isVerified: false,
    }),
    ("Musterfrau": { ... }),
  ];
}
```

## Instructions

### _Local Development:_

- Set **PRODUCTION** flag in api-server.js to false
- Prepare your local environment with the correct env-vars:

```sh
export PORT="8080"
export USER_SECRET="test"
export ADMIN_SECRET="test"
```

- Install modules and start the development server:

```sh
npm install
npm start
```

#### Testing Routes with cURL:

curl -d '{"person1":"Max"}' -H "Content-Type: application/json" -X POST http://localhost:8080/register

### _Deployment:_

Setup the gcloud command line tool following these [instructions](https://cloud.google.com/functions/docs/quickstart).

Follow [these steps](https://cloud.google.com/appengine/docs/standard/nodejs/building-app/deploying-web-service) to setup the project for deployment.

Repeat these steps before deployment:

- Set production flag in api-server.js to true
- Fill in all production secrets in [app.yaml](app.yaml)
- upload project:

```sh
gcloud app deploy
```
