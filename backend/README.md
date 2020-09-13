# Backend service for Charlies Laufgelage

## Instructions

**_Local:_**

Set production flag in api-server.js to false, then:

```sh
npm install
npm start
```

**_Deployment:_**

Setup the gcloud command line tool following these [instructions](https://cloud.google.com/functions/docs/quickstart).

Set production flag in api-server.js to false, then:

```sh
gcloud app init
gcloud app deploy
```
