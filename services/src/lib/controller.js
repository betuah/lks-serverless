const { SQSClient, DeleteMessageCommand } = require("/opt/node_modules/@aws-sdk/client-sqs");
const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require("/opt/node_modules/@aws-sdk/client-apigatewaymanagementapi");
const { buildResponse, randomNumber } = require("/opt/utilities");
const { initDatabase } = require("./connection");
const { eventSchema, orderSchema, ticketSchema } = require("./validation");

const getEvent = async () => {
   try {
      const { Event } = await initDatabase();
      const res = await Event.findAll();
      return buildResponse(200, "Get event success!", res);
   } catch (error) {
      console.error(`Get event error : ${error}`);
      return buildResponse(500, "Get event error!", null);
   }
};

const getEventById = async (id) => {
   try {
      const { Ticket, Event } = await initDatabase();
      const eventData = await Event.findByPk(id);

      if (eventData) {
         const ticketData = await Ticket.findAll({ 
            where: {
               eventId: id,
            }
         });

         const serialize = {
            eventId: eventData.eventId,
            title : eventData.title,
            desc : eventData.desc,
            category : eventData.category,
            image : eventData.image,
            date : eventData.date,
            publish : eventData.publish,
            location : eventData.location,
            tickets: ticketData || [] 
         };

         return buildResponse(200, "Get event by id success!", serialize);
      } else {
         return buildResponse(404, "Event not found!", null);
      }
   } catch (error) {
      console.error(`Get event by id error : ${error}`);
      return buildResponse(500, "Get event by id error!", null);
   }
};

const createEvent = async (rawBody) => {
   try {
      await eventSchema.validate(rawBody, { abortEarly: false });
      const { title, desc, category, image, date, publish, location } = rawBody;

      const { Event } = await initDatabase();
      const rawData = {
         title,
         desc,
         category,
         image,
         date,
         publish,
         location
      };
      await Event.create(rawData);

      return buildResponse(200, "Event is saved", rawData);
   } catch (error) {
      if (
         error.name === "ValidationError" ||
         error.name === "SequelizeUniqueConstraintError"
      ) {
         console.error(`Create event error : ${error.name}`);
         return buildResponse(400, "Validation Error!", error.errors);
      } else {
         console.error(`Create event error : ${error}`);
         return buildResponse(500, "Create event error!", null);
      }
   }
};

const updateEvent = async (rawBody) => {
   try {
      await eventSchema.validate(rawBody, { abortEarly: false });
      const {  eventId, title, desc, category, image, date, publish, location  } = rawBody;

      const { Event } = await initDatabase();
      const rawData = {
         title,
         desc,
         category,
         image,
         date,
         publish,
         location
      };
      await Event.update(rawData, { where: { eventId } });

      return buildResponse(200, "Update event success!", rawData);
   } catch (error) {
      if (error.name === "ValidationError") {
         return buildResponse(400, "Validation Error!", error.errors);
      } else {
         console.error(`Update event error : ${error}`);
         return buildResponse(500, "Update event error!", null);
      }
   }
};

const removeEvent = async (id) => {
   try {
      const { Event } = await initDatabase();
      const eventData = await Event.findByPk(id);

      if (!eventData) {
         return buildResponse(
            404,
            `Event with id ${id} is not found!`
         );
      } else {
         await Event.destroy({ where: { id } });
         return buildResponse(200, "Remove event success!", null);
      }
   } catch (error) {
      console.error(`Remove event error : ${error}`);
      return buildResponse(500, "Remove event error!", null);
   }
};

const createTicket = async (rawBody) => {
   try {
      await ticketSchema.validate(rawBody, { abortEarly: false });
      const { eventId, title, desc, price, stock } = rawBody;

      const { Ticket } = await initDatabase();
      const rawData = {
         eventId,
         title,
         desc,
         price,
         stock
      };
      await Ticket.create(rawData);

      return buildResponse(200, "Ticket is saved", rawData);
   } catch (error) {
      if (
         error.name === "ValidationError" ||
         error.name === "SequelizeUniqueConstraintError"
      ) {
         console.error(`Create ticket error : ${error.name}`);
         return buildResponse(400, "Validation Error!", error.errors);
      } else {
         console.error(`Create ticket error : ${error}`);
         return buildResponse(500, "Create ticket error!", null);
      }
   }
};

const removeTicket = async (id) => {
   try {
      const { Ticket } = await initDatabase();
      const data = await Ticket.findByPk(id);

      if (!data) {
         return buildResponse(
            404,
            `Ticket with id ${id} is not found!`
         );
      } else {
         await Ticket.destroy({ where: { id } });
         return buildResponse(200, "Remove ticket success!", null);
      }
   } catch (error) {
      console.error(`Remove ticket error : ${error}`);
      return buildResponse(500, "Remove ticket error!", null);
   }
};

const getOrder = async () => {
   try {
      const { Order, Event, Payment } = await initDatabase();
      const res = await Order.findAll({
         attributes: ['fullName', 'email', 'status'],
         include: [
            {
               model: Event,
               attributes: ['title']
            },
            {
               model: Payment,
               attributes: ['amount', 'status','paymentId']
            }
         ]
      });
      
      const serialize = res.map(i => ({
         orderId: i.orderId,
         status: i.status,
         fullName: i.fullName,
         event: i.tbl_event.title,
         paymentAmount: i.tbl_payment.amount,
         paymentStatus: i.tbl_payment.status,
         paymentId: i.tbl_payment.paymentId
      }));

      return buildResponse(200, "Get order success!", serialize);
   } catch (error) {
      console.error(`Get Order error : ${error}`);
      return buildResponse(500, "Get order error!", null);
   }
};

const createOrder = async (message, sqsUrl) => {
   try {
      const apiGateway = new ApiGatewayManagementApiClient({
         apiVersion: '2018-11-29',
         endpoint: `https://${process.env.WEBSOCKET_ID}.execute-api.us-east-1.amazonaws.com/dev`, // Retrieve the API endpoint from environment variables
      });

      const sqsClient = new SQSClient({ region: "us-east-1" });
      const { connectionId, body} = JSON.parse(message.body);
      const { sequelize, Ticket, Order, OrderDetail, Payment } = await initDatabase();
      const t = await sequelize.transaction();
   
      try {
         await orderSchema.validate(body, { abortEarly: false });
         const { fullName, email, phone, eventId, items, bank } = body;
         const phoneNumber = phone.replace(/^0/, '62');
         const genOrderId = `ODR${randomNumber(4)}`;
   
         await Order.create({
            orderId: genOrderId,
            eventId: eventId,
            fullName,
            phone: phoneNumber,
            email
         }, { transaction: t });
      
         for (const item of items) {
            await OrderDetail.create({
               orderId: genOrderId,
               ticketId: item.ticketId,
               qty: item.qty,
            }, { transaction: t });
         }
   
         let amount = 0;
         for (const item of items) {
            const ticket = await Ticket.findByPk(item.ticketId);
            ticket.stock = ticket.stock - item.qty;
            await ticket.save({ transaction: t });
            amount += (item.qty * ticket.price);
         }
   
         await Payment.create({
            paymentId: `PAY${randomNumber(4)}`,
            orderId: genOrderId,
            paymentMethod: "bank-transfer",
            amount,
            bank,
   
         }, { transaction: t });
      
         const deleteMessageCommand = new DeleteMessageCommand({ QueueUrl: sqsUrl, ReceiptHandle: message.receiptHandle });
         await sqsClient.send(deleteMessageCommand);
         await t.commit();
         
         await sendMessage(connectionId, {
            connectionId,
            message: "OK"
         })

         return { success: true, error: null };
      } catch (error) {
         await t.rollback();
         throw error;
      }
   } catch(err) {
      if (
         err.name === "ValidationError" ||
         err.name === "SequelizeUniqueConstraintError"
      ) {
         console.error(`Create order error : ${err}`);
         return { success: false, error: err.errors };
      } else {
         console.error(`Create order error : ${err}`);
         return { success: false, error: err };
      }
   }
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
}

module.exports = { getEvent, getEventById, getOrder, createEvent, createTicket, createOrder, updateEvent, removeEvent, removeTicket };
