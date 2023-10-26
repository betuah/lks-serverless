const { TextractClient, StartDocumentTextDetectionCommand, GetDocumentTextDetectionCommand } = require("/opt/node_modules/@aws-sdk/client-textract");
const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require("/opt/node_modules/@aws-sdk/client-apigatewaymanagementapi");
const { buildResponse } = require("/opt/utilities");

const region = "us-east-1";
const textractClient = new TextractClient({ region });

const apiGateway = new ApiGatewayManagementApiClient({
   apiVersion: '2018-11-29',
   endpoint: `https://${process.env.WEBSOCKET_ID}.execute-api.us-east-1.amazonaws.com/dev`, // Retrieve the API endpoint from environment variables
});

module.exports.handler = async (event) => {
   const Messages = event.Records;
   
   if (Messages) {
      // Message proccessing
      for (const message of Messages) {
         try {
            const { bucketName, key, connectionId } = JSON.parse(message.body);
            console.log(`Get image from S3: ${bucketName}/${key}`);
            
            const jobId = await startTextDetection(bucketName, key);
            console.log("Started text detection. Job ID:", jobId);
            
            let jobStatus;
            do {
              await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
              const { JobStatus } = await getTextDetectionResults(jobId);
              console.log(`Scanning status: ${JobStatus}`);
              jobStatus = JobStatus;
            } while (jobStatus === "IN_PROGRESS");
            
            const { Blocks } = await getTextDetectionResults(jobId);
            const amount = getAmount(Blocks);
            
            await sendMessage(connectionId, {
               connectionId,
               status: "OK"
            });
            
            console.log("Text detection completed.");
            console.log(`Tranffer amount : ${amount}`);
         } catch (error) {
            console.error("Error processing message:", error);
         }
      }
   }  

   return buildResponse(200, "Processing complete.", null);
};

const startTextDetection = async (bucketName, key) => {
   const startCommand = new StartDocumentTextDetectionCommand({
      DocumentLocation: {
         S3Object: {
            Bucket: bucketName,
            Name: key,
         },
      },
   });
            
   const { JobId } = await textractClient.send(startCommand);
   return JobId;
};

const getTextDetectionResults = async (jobId) => {
   const getCommand = new GetDocumentTextDetectionCommand({
      JobId: jobId,
   });
            
   const { JobStatus, Blocks } = await textractClient.send(getCommand);
   return { JobStatus, Blocks};
};

const getAmount = (blocks) => {
  const amountBlock = blocks.find((block) => block.BlockType === "LINE" && block.Text && block.Text.includes("Rp"));

  if (amountBlock) {
    return amountBlock.Text;
  }

  return null;
};

const sendMessage = async (targetId, message) => {
   try {
      const params = {
         ConnectionId: targetId,
         Data: JSON.stringify(message),
      };
   
      const sendCommand = new PostToConnectionCommand(params);
      await apiGateway.send(sendCommand);
   } catch (error) {
      console.log(`SendMessage error : ${error}`);
   }
};
