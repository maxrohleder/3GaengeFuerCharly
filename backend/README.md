# Backend service for Charlies Laufgelage

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
