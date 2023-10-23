const { buildResponse } = require("/opt/utilities");
const { createOrder } = require("./lib/controller");

module.exports.handler = async (event) => {
   const Messages = event.Records;
   const queueUrl = process.env.SQS_QUEUE_URL;
   
   if (Messages) {
      // Message proccessing
      for (const message of Messages) {
         try {
            console.log("Processing Message:", message);
            const result = await createOrder(message, queueUrl);

            if (result.success) {
               console.log("Processing message success!");
               console.log("Message was deleted:", message.messageId);
            } else {
               throw result.error;
            }
         } catch (error) {
            console.error("Error processing message:", error);
         }
      }
   }  

   return buildResponse(200, "Processing complete.", null);
};
