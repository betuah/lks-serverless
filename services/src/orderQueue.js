const { buildResponse, randomNumber } = require("/opt/utilities");
const { SQSClient, SendMessageCommand } = require('/opt/node_modules/@aws-sdk/client-sqs');

const sqsClient = new SQSClient({ region: 'us-east-1' });
const queueUrl = process.env.SQS_QUEUE_URL;

module.exports.handler = async (event) => {
   try {
      const httpMethod = event?.httpMethod;
      const pathRequest = event?.path?.split("/")[1];

      if (pathRequest != "order" && httpMethod != "POST") {
         return buildResponse(400, "Bad Request!", null);
      }

      const body = JSON.parse(event.body);
      const rawData = {
         connectionId: body.connectionId,
         body: body.data
      };

      const params = {
         QueueUrl: queueUrl,
         MessageGroupId: randomNumber(16),
         MessageBody: JSON.stringify(rawData)
      };
      
      const command = new SendMessageCommand(params);
      const response = await sqsClient.send(command);

      return buildResponse(200, "Success", response);
   } catch (e) {
      console.error(`Got error while writing event : ${e}`);
      return buildResponse(500, "Internal Server Error", null);
   }
}
