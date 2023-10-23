const crypto = require("crypto");
const moment = require("/opt/node_modules/moment");
const saltedMd5 = require("/opt/node_modules/salted-md5");
const {
   PutItemCommand,
   DynamoDBClient,
} = require("/opt/node_modules/@aws-sdk/client-dynamodb");
const { buildResponse } = require("/opt/utilities");

const config = { region: "us-east-1" };
const client = new DynamoDBClient(config);
const TableName = "tokens";

module.exports.handler = async (event) => {
   try {
      const { deviceId, expired } = JSON.parse(event.body);
      const currentDate = moment();
      const token = saltedMd5(moment().unix(), crypto.randomBytes(16));
      const expiredDate = moment(currentDate)
         .add(expired, "days")
         .toISOString();

      const params = {
         TableName,
         Item: {
            token: { S: token },
            deviceId: { S: deviceId },
            expiredDate: { S: expiredDate },
            createdAt: { S: moment(currentDate).toISOString() },
         },
         ConditionExpression: "attribute_not_exists(deviceId)",
      };

      const command = new PutItemCommand(params);
      await client.send(command);

      const resBody = {
         token,
         deviceId,
         expired: expiredDate,
         createdAt: moment(currentDate).toISOString(),
      };

      return buildResponse(200, "Generate token success", resBody);
   } catch (e) {
      console.error("Error generate token : " + e);
      return buildResponse(500, "Generate token error!", e);
   }
};
