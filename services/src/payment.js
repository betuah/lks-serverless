const { buildResponse } = require("/opt/utilities");

module.exports.handler = async (event) => {
   const Messages = event.Records;
   const region = "us-east-1";

   console.log("Payment success...")
   
   // if (Messages) {
   //    // Message proccessing
   //    for (const message of Messages) {
   //       try { 
            
            
   //          console.log(blocks);
   //       } catch (error) {
   //          console.error("Error processing message:", error);
   //       }
   //    }
   // }  

   return buildResponse(200, "Processing complete.", null);
};
