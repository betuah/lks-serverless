const { sendMessage, getConnectionId, broadcastMessage, deleteConnectionId, storeConnectionId } = require("./service");

exports.handler = async (event) => {
   const connectionId = event.requestContext.connectionId;
   
   try {
      switch (event.requestContext.routeKey) {
         case '$connect':
            await storeConnectionId(connectionId);
            break;
         case '$disconnect':
            await deleteConnectionId(connectionId);
            break;
         case 'sendMessage':
            const { message, targetId }  = JSON.parse(event.body);
            await sendMessage(message, connectionId, targetId);
            break;
         case 'getConnectionId':
            await getConnectionId(connectionId);
            break;
         case 'broadcastMessage':
            const body = JSON.parse(event.body);
            await broadcastMessage(body.message);
            break;
         default:
            console.log(event.requestContext.routeKey);
            console.log(`Unsupported route: ${event.requestContext.routeKey}`);
      }
   } catch (error) {
      console.error(`Error processing WebSocket event: ${error}`);
   }

   return { statusCode: 200 };
}; 