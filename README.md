

# Ticketing System
This is a ticket application for selling concert tickets to the public, organized by SoundWave Productions. The repository contains two folders: front-end and service. The front-end folder contains the source code for the web application, while the service folder contains the source code for the backend API, which is implemented using a serverless architecture.

## TechStack

Ticketing System uses a number of technology stack to work properly:
- [node.js] - Runtime for the lambda function
- [Vue] - Progressive, incrementally-adoptable JavaScript framework
- [Vite] - Fast and modern bundler for building frontend apps.
- [Vuetify] - Material Design for Vue
- [dynamodb] - Fast, flexible NoSQL database service for single-digit millisecond performance at any scale by AWS
- [PostgresQL] - Powerful, open-source, relational database.
- [S3] - Scalable, durable, secure object storage

<hr>

## Font-End Setup
The root folder for Front-End projects is **front-end**.
### Front-End Environment Variable

```sh
VITE_BASE_API_URL=YOUR_API_ENDPOINT
VITE_WEBSOCKET_URL=YOU_WEBSOCKET_ENDPOINT
VITE_API_TOKEN=YOUR_AUTH_TOKEN
VITE_DEVICE_ID=YOUR_AUTH_DEVICEID
```

### Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
<hr>

## Backend - API Setup (Serverless)
The root folder for backend projects is **service**.
#### Lambda Setup
All dependencies required by each Lambda function are located in the **src/layer** folder and are bundled into a layer with name lks-layer.

| Name | Code Source | Environment | Description  |
|--|--|--|--|
| **lks-auth** | src/auth.js | - | This function is used as a middleware to handle custom authorization on API Gateway. It uses a maximum of 128MB of memory and has a maximum execution time of 3 seconds. |
| **lks-token** | src/token.js | - | This function is used to generate Authorization token and deviceid. It uses a maximum of 128MB of memory and has a maximum execution time of 5 seconds. |
| **lks-read-event** | src/lib, src/eventRead.js | - | This function is used to display event data from the database. It uses a maximum of 128MB of memory and has a maximum execution time of 5 seconds. |
| **lks-write-event** | src/lib, src/eventWrite.js | - | This function is used to save, update and delete event data to the database.It uses a maximum of 256MB of memory and has a maximum execution time of 5 seconds. |
| **lks-ticket** | src/lib, src/ticket.js | - | This function is used to save and delete ticket of the event data to the database. It uses a maximum of 128MB of memory and has a maximum execution time of 3 seconds. |
| **lks-read-order** | src/lib, src/orderRead.js | - | This function is used to display order data from the database. It uses a maximum of 128MB of memory and has a maximum execution time of 5 seconds. |
| **lks-write-order** | src/lib, src/orderWrite.js | SQS_QUEUE_URL, WEBSOCKET_ID | This function is used as a SQS consumer to proccess order from SQS and save data to the database. It uses a maximum of 256MB of memory and has a maximum execution time of 10 seconds. |
| **lks-queue-order** | src/lib, src/OrderQueue.js | SQS_QUEUE_URL, WEBSOCKET_ID | This function is used to send request data to SQS. It uses a maximum of 128MB of memory and has a maximum execution time of 3 seconds. |
| **lks-queue-payment** | src/lib, src/paymentQueue.js | SQS_QUEUE_URL | This function is used send S3 metadata to SQS. It uses a maximum of 128MB of memory and has a maximum execution time of 3 seconds. |
| **lks-payment** | src/lib, src/payment.js | SQS_QUEUE_URL | This function is used as a SQS consumer to process payment. It uses a maximum of 256MB of memory and has a maximum execution time of 10 seconds. |
| **lks-websocket** | src/websocket.js | - | This function is used handle websocket. It uses a maximum of 256MB of memory and has a maximum execution time of 5 seconds. |
#### API Endpoint

You can check the API endpoint documentation in [here]

## License

MIT

**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [dill]: <https://github.com/betuah/lks-course-order>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [node.js]: <http://nodejs.org>
   [sequelize]: <https://sequelize.org>
   [express]: <http://expressjs.com>
   [Vue]: <https://mochajs.org/>
   [Vuetify]: <https://vuetifyjs.com/>
   [Vite]: <https://vitejs.dev/>
   [PostgresQL]: <https://www.postgresql.org/>
   [AWS-SDK]: <https://aws.amazon.com/id/sdk-for-javascript/#:~:text=The%20AWS%20SDK%20for%20JavaScript%20simpli%EF%AC%81es%20use%20of%20AWS%20Services,marshaling%2C%20serialization%2C%20and%20deserialization.>
   [aws-ssm]: <https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html>
   [here]: <https://documenter.getpostman.com/view/2061573/2s9YRCXWm7>
   [S3]: <https://aws.amazon.com/id/s3>
   [dynamodb]: <https://aws.amazon.com/id/dynamodb/?trk=fb31ef7c-dff3-4b64-b3eb-6d667ece9f85&sc_channel=ps&s_kwcid=AL!4422!3!536452582733!e!!g!!dynamodb&ef_id=Cj0KCQjw1vSZBhDuARIsAKZlijSWMN1Cvsbzx6A6NnjWKqp-NtJEIw1M3X1B_U6HM54NStAjBRqH3YoaAq3oEALw_wcB:G:s&s_kwcid=AL!4422!3!536452582733!e!!g!!dynamodb>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>
