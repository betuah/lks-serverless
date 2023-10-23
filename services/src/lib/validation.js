const yup = require("/opt/node_modules/yup");

const ticketSchema = yup.object().shape({
   eventId: yup.string().required(),
   title: yup.string().required(),
   desc: yup.string(),
   price: yup.number().positive().integer().required(),
   stock: yup.number().positive().integer().required(),
})

const eventSchema = yup.object().shape({
   title: yup.string().required(),
   desc: yup.string(),
   image: yup.string().required(),
   date: yup.string().required(),
   category: yup.string().required(),
   publish: yup.bool(),
   location: yup.string().required()
});

const ticketOrderSchema = yup.object().shape({
   ticketId: yup.string(),
   qty: yup.number().positive().integer().required()
})

const orderSchema = yup.object().shape({
   fullName: yup.string().required(),
   email: yup.string().required(),
   phone: yup.string().required(),
   eventId: yup.string().required(),
   items: yup.array().of(ticketOrderSchema).required(),
   bank: yup.string().required(),
});

module.exports = { eventSchema, ticketSchema, orderSchema };
