const { DynamoDBClient, ScanCommand, PutItemCommand, DeleteItemCommand } = require('/opt/node_modules/@aws-sdk/client-dynamodb');
const { unmarshall } = require("/opt/node_modules/@aws-sdk/util-dynamodb");
const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require("/opt/node_modules/@aws-sdk/client-apigatewaymanagementapi");
const dynamodb = new DynamoDBClient({ region: 'us-east-1' });
const apiGateway = new ApiGatewayManagementApiClient({
   apiVersion: '2018-11-29',
   endpoint: `https://${process.env.WEBSOCKET_ID}.execute-api.us-east-1.amazonaws.com/dev`, // Retrieve the API endpoint from environment variables
});

const getConnectedClients = async () => {
  try {
      const command = new ScanCommand({ TableName: 'wssConnections' });
      const response = await dynamodb.send(command);
      
      if (response.Items.length > 0) {
         
         const items = response.Items.map((item) => unmarshall(item));
         const serialize = items.map(i => i.connectionId);
         return serialize;
      } else {
         return [];
      }
      
   } catch (e) {
      console.error(e);
   } 
};

const getConnectionId = async (connectionId) => {
   try {
      const params = {
         ConnectionId: connectionId,
         Data: JSON.stringify({ connectionId }),
      };
   
      const cmd = new PostToConnectionCommand(params);
      await apiGateway.send(cmd);
   } catch (error) {
      console.error("Get connection id error : " + error);
      
   }
};

const storeConnectionId = async (connectionId) => {
   try {
      const params = {
         TableName: 'wssConnections', 
         Item: {
            connectionId: { S: `${connectionId}` },
         },
      };
      
      await dynamodb.send(new PutItemCommand(params));
   } catch (e) {
      console.error("store connection error: " + e);
   }
};

const deleteConnectionId = async (connectionId) => {
   try {
      const params = {
         TableName: 'wssConnections', 
         Key: {
            connectionId: { S: connectionId },
         },
      };
   
      await dynamodb.send(new DeleteItemCommand(params));
   } catch (e) {
      console.error("delete connection error: " + e);
   }
};

const sendMessage = async (message, connectionId, targetId) => {
   const rawData = {
      status: "OK",
      targetId,
   };
   
   const paramsReplay = {
      ConnectionId: connectionId,
      Data: JSON.stringify(rawData),
   };
   
   const paramsSending = {
      ConnectionId: targetId,
      Data: JSON.stringify(message),
   };

   const commandReplay = new PostToConnectionCommand(paramsReplay);
   const commandSend = new PostToConnectionCommand(paramsSending);
   await apiGateway.send(commandReplay);
   await apiGateway.send(commandSend);
};

const broadcastMessage = async (message, connectionId) => {
   const clients = await getConnectedClients();

   // Send the message to each connected client
   const promises = clients.map(async (client) => {
      try {
         const commandSend = new PostToConnectionCommand({
            ConnectionId: client,
            Data: message,
         });
         await apiGateway.send(commandSend);
      } catch (error) {
         console.error(`Error sending message to ${client}: ${error}`);
      }
   });

   // Wait for all messages to be sent
   await Promise.all(promises);
};

module.exports = { deleteConnectionId, getConnectionId, sendMessage, broadcastMessage, storeConnectionId };