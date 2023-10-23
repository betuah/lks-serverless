const {
   SSMClient,
   GetParametersCommand,
} = require("/opt/node_modules/@aws-sdk/client-ssm");

const ssmClient = new SSMClient({ region: "us-east-1" });

const getParameter = async (parameterNames, decryption = false) => {
   const params = {
      Names: parameterNames,
      WithDecryption: decryption,
   };

   try {
      const command = new GetParametersCommand(params);
      const response = await ssmClient.send(command);
      const parameters = {};

      response.Parameters.forEach((param) => {
         const keyParts = param.Name.split("/");
         const simplifiedKey = keyParts[keyParts.length - 1];

         parameters[simplifiedKey] = param.Value;
      });

      return parameters;
   } catch (error) {
      console.error("Error while get parameters: ", error);
      throw error;
   }
};

module.exports = { getParameter };
