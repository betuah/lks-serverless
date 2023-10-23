const { buildResponse, randomNumber } = require("/opt/utilities");
const { SQSClient, SendMessageCommand } = require('/opt/node_modules/@aws-sdk/client-sqs');

const sqsClient = new SQSClient({ region: 'us-east-1' });
const queueUrl = process.env.SQS_QUEUE_URL;

module.exports.handler = async (event) => {
   try {
      const s3 = event.Records[0].s3;
      const bucketName = s3.bucket.name;
      const key = s3.object.key;
      const rawData = { bucketName, key };
      
      const params = {
         QueueUrl: queueUrl,
         MessageGroupId: randomNumber(16),
         MessageBody: JSON.stringify(rawData)
      };
      
      const command = new SendMessageCommand(params);
      const response = await sqsClient.send(command);
      
      return buildResponse(200, "Success", response);
   } catch (e) {
      console.error(`Got error while writing Product : ${e}`);
      return buildResponse(500, "Internal Server Error", null);
   }
};
