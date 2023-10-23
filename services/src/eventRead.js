const { buildResponse } = require("/opt/utilities");
const { getEvent, getEventById } = require("./lib/controller");

module.exports.handler = async (event) => {
   try {
      const httpMethod = event?.httpMethod;
      const pathRequest = event?.resource;

      if (httpMethod == "GET" && pathRequest == "/event") {
         return await getEvent();
      } else if (httpMethod == "GET" && pathRequest == "/event/{id}") {
         const eventId = event.pathParameters.id;
         return await getEventById(eventId);
      } else {
         return buildResponse(400, "BAD REQUEST!", null);
      }
   } catch (e) {
      console.error(`Got error while read Product : ${e}`);
      return buildResponse(500, "Internal Server Error", null);
   }
};
