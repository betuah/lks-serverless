const { buildResponse } = require("/opt/utilities");
const { getOrder } = require("./lib/controller");

module.exports.handler = async (event) => {
   try {
      const httpMethod = event?.httpMethod;
      const pathRequest = event?.path?.split("/")[1];

      if (httpMethod == "GET" && pathRequest == "order") {
         return await getOrder();
      } else {
         return buildResponse(400, "BAD REQUEST!", null);
      }
   } catch (e) {
      console.error(`Got error while read Product : ${e}`);
      return buildResponse(500, "Internal Server Error", null);
   }
};
