const {
   GetItemCommand,
   DynamoDBClient,
} = require("/opt/node_modules/@aws-sdk/client-dynamodb");
const {
   marshall,
   unmarshall,
} = require("/opt/node_modules/@aws-sdk/util-dynamodb");
const moment = require("/opt/node_modules/moment");

const config = { region: "us-east-1" };
const client = new DynamoDBClient(config);
const TableName = "tokens";

const generatePolicy = (id, permission, resource) => {
   return {
      principalId: `${id}`,
      policyDocument: {
         Version: "2012-10-17",
         Statement: [
            {
               Effect: `${permission}`,
               Action: "execute-api:Invoke",
               Resource: `${resource}`,
            },
         ],
      },
      context: {
         scope: null,
      },
   };
};

module.exports.handler = async (event, context, callback) => {
   try {
      const token = event.headers.Authorization;
      const deviceId = event.headers.Deviceid || event.headers.deviceid;
      const resource = event.methodArn;

      const params = {
         TableName,
         Key: marshall({
            token,
            deviceId,
         }),
      };

      const getCommand = new GetItemCommand(params);
      const response = await client.send(getCommand);

      if (response.Item) {
         const validToken = unmarshall(response.Item);
         const currentDate = moment();
         const hasPassed = moment(currentDate).isBefore(validToken.expiredDate);

         if (hasPassed) {
            return generatePolicy("authId", "Allow", resource);
         } else {
            console.error("Token expired!");
            return generatePolicy("authId", "Deny", resource);
         }
      } else {
         console.error("Invalid Token!");
         return generatePolicy("authId", "Deny", resource);
      }
   } catch (e) {
      console.error("Auth error : " + e);
      return generatePolicy("authId", "Deny", event.methodArn);
   }
};
