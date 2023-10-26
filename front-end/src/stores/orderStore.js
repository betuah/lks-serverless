import { defineStore } from "pinia";
import axios from "axios";
import { useNotifStore } from "./notifStore";
import { useEventStore } from "./eventStore";

const api_url = `${import.meta.env.VITE_BASE_API_URL}`;
const headers = {
   Authorization: `${import.meta.env.VITE_API_TOKEN}`,
   Deviceid: `${import.meta.env.VITE_DEVICE_ID}`,
   "Content-Type": "application/json", 
}

export const useOrderStore = defineStore("orderStore", {
   stores: { notifStore: useNotifStore,  },
   state: () => ({
      ticketOrder: [],
      totalTickets: 0,
   }),
   actions: {
      async createOrder(rawData) {
         const notifStore = useNotifStore();

         try {
            const response = await axios.post(`${api_url}/order`, rawData , { headers });
            const httpStatus = response.status;
            if (httpStatus === 200) {
               return true
            } else {
               throw "Create order error!"
            }
         } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            notifStore.setSnackbar("error", message, true);
         }
      },
      async uploadPayment(image, format, type) {
         const notifStore = useNotifStore();
         const customHeaders = {
            Authorization: headers.Authorization,
            Deviceid: headers.Deviceid,
            "Content-Type": `${type}`,
         };

         try {
            const response = await axios.put(`${api_url}/payment/${new Date().getTime()}.${format}`, { image } , { headers: customHeaders });
            const httpStatus = response.status;
            if (httpStatus === 200) {
               return true
            } else {
               throw "Upload error!"
            }
         } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            notifStore.setSnackbar("error", message, true);
            return false
         }
      },
      async setOrder(ticketOrder, event) {
         this.ticketOrder = ticketOrder
         this.event = event
      },
      async addOrderItem(ticketId) {
         const eventStore = useEventStore(); 
         const orders = this.ticketOrder
         const existingItem = orders.find(i => i.ticketId == ticketId)
         if (existingItem) {
            existingItem.qty++;
            existingItem.amount += existingItem.price
         } else {
            const eventData = eventStore.eventDetails.tickets.map(i => ({...i, qty: 0}));
            const a = eventData.find(t => t.ticketId == ticketId)
            a.qty++;
            a.amount = a.price
            orders.push(a);
         }
         this.totalTickets++;
      },
      async removeOrderItem(ticketId) {
         const orderData = this.ticketOrder
         const existingitem = orderData.find(i => i.ticketId == ticketId)
         if (existingitem) {
            existingitem.qty--;
            existingitem.amount -= existingitem.price;

            if (existingitem.qty <= 0) {
               const index = orderData.indexOf(existingitem);
               orderData.splice(index, 1);
            }
         }
         this.totalTickets--;
      },
      async resetOrder() {
         this.ticketOrder = [];
         this.totalTickets = 0;
      }
   },
});
