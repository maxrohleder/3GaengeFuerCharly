# Backend service for Charlies Laufgelage

## Instructions

**_Local:_**

Testing Routes with cURL:

curl -d '{"person1":"Max"}' -H "Content-Type: application/json" -X POST http://localhost:8080/register

Set production flag in api-server.js to false, then:

```sh
npm install
npm start
```

**_Deployment:_**

Setup the gcloud command line tool following these [instructions](https://cloud.google.com/functions/docs/quickstart). Follow [these steps](https://cloud.google.com/appengine/docs/standard/nodejs/building-app/deploying-web-service) to setup the project for deployment.

Set production flag in api-server.js to false, then:

```sh
gcloud app init
gcloud app deploy
```
