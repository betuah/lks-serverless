const { Sequelize, DataTypes } = require("/opt/node_modules/sequelize");
const { getParameter } = require("./service");

const initDatabase = async () => {
   try {
      console.log("Tyring to get env from paramter store...");
      const params = [
         "/lks/database/dbname",
         "/lks/database/username",
         "/lks/database/password",
         "/lks/database/endpoint",
      ];
      const env = await getParameter(params, true);
      const { dbname, username, password, endpoint } = env;
      console.log(`get environment success : ${env}`);

      console.log("Trying connect to database...");
      const sequelize = new Sequelize(dbname, username, password, {
         host: endpoint,
         dialect: "postgres", // Database Engine
         dialectOptions: {
            ssl: true,
         },
      });

      await sequelize.authenticate();
      console.log("Database connection established");

      // Event table Schema
      const Event = sequelize.define(
         "tbl_event",
         {
            eventId: {
               type: DataTypes.UUID,
               primaryKey: true,
               unique: true,
               allowNull: false,
               defaultValue: DataTypes.UUIDV4,
            },
            title: {
               type: DataTypes.STRING,
               allowNull: false,
            },
            desc: {
               type: DataTypes.TEXT,
               allowNull: true
            },
            category: {
               type: DataTypes.STRING,
               allowNull: false,
            },
            image: {
               type: DataTypes.STRING,
               allowNull: false,
            },
            date: {
               type: DataTypes.DATE,
               allowNull: false,
            },
            publish: {
               type: DataTypes.BOOLEAN,
               allowNull: false,
               defaultValue: true
            },
            location: {
               type: DataTypes.TEXT,
               allowNull: false,
            }
         },
         {
            freezeTableName: true,
            timestamps: true,
         }
      );

      // Ticket table Schema
      const Ticket = sequelize.define(
         "tbl_ticket",
         {
            ticketId: {
               type: DataTypes.UUID,
               primaryKey: true,
               unique: true,
               allowNull: false,
               defaultValue: DataTypes.UUIDV4,
            },
            eventId: {
               type: DataTypes.UUID,
               allowNull: false,
            },
            title: {
               type: DataTypes.STRING,
               allowNull: false,
            },
            desc: {
               type: DataTypes.TEXT,
               allowNull: true
            },
            price: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            stock: {
               type: DataTypes.INTEGER,
               allowNull: false,
            }
         },
         {
            freezeTableName: true,
            timestamps: true,
         }
      );

      // Order table Schema
      const Order = sequelize.define(
         "tbl_order",
         {
            orderId: {
               type: DataTypes.STRING,
               primaryKey: true,
               unique: true,
               allowNull: false,
            },
            eventId: {
               type: DataTypes.UUID,
               allowNull: false,
            },
            fullName: {
               type: DataTypes.STRING,
               allowNull: false,
            },
            email: {
               type: DataTypes.STRING,
               allowNull: false,
            },
            phone: {
               type: DataTypes.STRING,
               allowNull: false,
            },
            status: {
               type: DataTypes.ENUM,
               allowNull: false,
               values: ['pending','expired','success'],
               defaultValue: "pending"
            }
         },
         {
            freezeTableName: true,
            timestamps: true,
         }
      );

      // Order Detail table Schema
      const OrderDetail = sequelize.define(
         "tbl_order_detail",
         {
            orderDetailId: {
               type: DataTypes.INTEGER,
               primaryKey: true,
               allowNull: false,
               autoIncrement: true,
            },
            orderId: {
               type: DataTypes.STRING,
               allowNull: false,
            },
            ticketId: {
               type: DataTypes.UUID,
               allowNull: false,
            },
            qty: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
         },
         {
            freezeTableName: true,
            timestamps: true,
         }
      );

      // Payment table Schema
      const Payment = sequelize.define(
         "tbl_payment",
         {
            paymentId: {
               type: DataTypes.STRING,
               primaryKey: true,
               unique: true,
               allowNull: false,
            },
            orderId: {
               type: DataTypes.STRING,
               allowNull: false,
            },
            amount: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            paymentMethod: {
               type: DataTypes.STRING,
               allowNull: false,
               default: "bank-transfer",
            },
            bank: {
               type: DataTypes.STRING,
               allowNull: true
            },
            status: {
               type: DataTypes.ENUM,
               allowNull: false,
               values: ['pending','expired','success'],
               defaultValue: "pending"
            },
            proofOfPayment: {
               type: DataTypes.STRING,
            },
         },
         {
            freezeTableName: true,
            timestamps: true,
         }
      );

      // Relasional

      // Relation between Event and Order
      Event.hasMany(Ticket, { foreignKey: 'eventId' });
      Ticket.belongsTo(Event, { foreignKey: 'eventId' });

      // Relation between Event and Order
      Event.hasMany(Order, { foreignKey: 'eventId' });
      Order.belongsTo(Event, { foreignKey: 'eventId' });

      // Relation between Order and OrderDetail
      Order.hasMany(OrderDetail, { foreignKey: 'orderId' });
      OrderDetail.belongsTo(Order, { foreignKey: 'orderId' });

      // Relation between Product and OrderDetail
      Ticket.hasMany(OrderDetail, { foreignKey: 'ticketId' });
      OrderDetail.belongsTo(Ticket, { foreignKey: 'ticketId' });

      // Relation between Order and Payment
      Order.hasOne(Payment, { foreignKey: 'orderId' });
      Payment.belongsTo(Order, { foreignKey: 'orderId' });

      console.log("Sync database model...");
      await sequelize.sync();
      console.log("Database connection established and models synchronized.");

      return { sequelize, Event, Ticket, Order, OrderDetail, Payment };
   } catch (error) {
      console.error("Error during database initialization:", error);
      throw error;
   }
};

module.exports = { initDatabase };
