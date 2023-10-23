const buildResponse = (statusCode, message, body) => {
   const rawBody = {
      statusCode,
      message,
      data: body,
   };

   return {
      statusCode,
      headers: {
         "Content-Type": "application/json",
         "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,DeviceId,deviceId,Deviceid,X-Api-Key,X-Amz-Security-Token",
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
      },
      body: JSON.stringify(rawBody),
   };
};

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

const randomNumber = (digits = 4) => {
   const min = Math.pow(10, digits - 1);
   const max = Math.pow(10, digits) - 1;

   return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomString = (char = 12) => {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let result = '';

   for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
   }

   return result;
}

module.exports = { buildResponse, generatePolicy, randomNumber, randomString };
