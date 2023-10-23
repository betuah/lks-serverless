const { buildResponse } = require("/opt/utilities");
const { createEvent, updateEvent, removeEvent } = require("./lib/controller.js");

module.exports.handler = async (event) => {
   try {
      const httpMethod = event?.httpMethod;
      const pathRequest = event?.path?.split("/")[1];

      if (pathRequest != "event") {
         return buildResponse(400, "Bad Request!", null);
      }

      switch (httpMethod) {
         case "POST":
            const body = JSON.parse(event.body);
            return await createEvent(body);
         case "PUT":
            const updateData = JSON.parse(event.body);
            return await updateEvent(updateData);
         case "DELETE":
            const eventId = event?.pathParameters?.id;
            return await removeEvent(eventId);
         default:
            return buildResponse(400, "Bad Request!", null);
      }
   } catch (e) {
      console.error(`Got error while writing event : ${e}`);
      return buildResponse(500, "Internal Server Error", null);
   }
};
