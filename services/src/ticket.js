const { buildResponse } = require("/opt/utilities");
const { createTicket, removeTicket } = require("./lib/controller.js");

module.exports.handler = async (event) => {
   try {
      const httpMethod = event?.httpMethod;
      const pathRequest = event?.path?.split("/")[1];

      if (pathRequest != "ticket") {
         return buildResponse(400, "Bad Request!", null);
      }

      switch (httpMethod) {
         case "POST":
            const body = JSON.parse(event.body);
            return await createTicket(body);
         case "DELETE":
            const ticketId = event?.pathParameters?.id;
            return await removeTicket(ticketId);
         default:
            return buildResponse(400, "Bad Request!", null);
      }
   } catch (e) {
      console.error(`Got error while writing ticket : ${e}`);
      return buildResponse(500, "Internal Server Error", null);
   }
};
