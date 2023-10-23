<template>
   <div>
      <div class="px-3">
         <VProgressLinear
            v-if="loading"
            indeterminate
            rounded
            height="2"
            color="primary"
         />
      </div>
      <v-row class="px-3 mb-4 mt-2">
         <v-col col="12" md="8">
            <div class="d-flex flex-column">
               <v-card class="rounded-lg mb-6">
                  <VImg :aspect-ratio="16/6" cover :src="data.image"/>
               </v-card>
               <VTabs v-model="currentTab" grow>
                  <VTab class="font-weight-bold text-sm text-uppercase">Description</VTab>
                  <VTab class="font-weight-bold text-sm text-uppercase">Ticket</VTab>
               </VTabs>
               <div class="pt-5">
                  <div v-if="currentTab === 0">
                     <span v-html="data.desc" class="text-sm text-justify"></span>
                  </div>
                  <div v-if="currentTab === 1">
                     <span class="font-weight-bold text-sm font-italic text-error">Notes: You can only order 4 ticket.</span>
                     <div v-if="tickets" class="d-flex flex-column">
                        <TicketItem
                           v-for="item in tickets" 
                           :key="item.id" 
                           :id="item.ticketId"
                           :title="item.title"
                           :desc="item.desc"
                           :price="item.price || 0"
                           :stock="item.stock || 0"
                        />
                     </div>
                     <div v-else class="d-flex flex-column">
                        <span class="text-sm text-justify">No ticket available.</span>
                     </div>
                  </div>
               </div>
            </div>
         </v-col>
         <v-col col="12" md="4" class="d-flex flex-column">
            <v-card class="pa-4 rounded-lg">
               <span class="text-lg font-weight-bold">{{ data.title }}</span>
               <div class="d-flex align-center text-md font-weight-medium mt-5">
                  <VIcon :size="18" icon="tabler-calendar" />
                  <span class="ml-2">{{ moment(data.date).format("DD MMMM YYYY") }}</span>
               </div>
               <div class="d-flex align-center text-md font-weight-medium">
                  <VIcon :size="18" icon="tabler-tag" />
                  <span class="ml-2">{{ data.category }}</span>
               </div>
               <div class="d-flex align-center text-md font-weight-medium">
                  <VIcon :size="18" icon="tabler-map-pin" />
                  <span class="ml-2">{{ data.location }}</span>
               </div>
               <VDivider class="border-dashed border-opacity-25 my-3" thickness="1" />
               <div class="d-flex flex-row align-center">
                  <VAvatar
                     color="primary"
                     icon="tabler-building-skyscraper"
                  />
                  <div class="d-flex flex-column ml-2">
                     <span class="text-sm text-disabled">Organize by</span>
                     <span class="text-md font-weight-bold">SW Production</span>
                  </div>
               </div>
            </v-card>
            <v-card v-if="data.publish" class="pa-4 rounded-lg mt-5 d-flex flex-column">
               <span class="text-sm align-self-center text-center">Registration will close on <span class="font-weight-bold"><br>{{ moment(data.date).format("DD") - 2 }} {{ moment(data.date).format("MMMM YYYY") }}.</span></span>
               <VDivider class="border-dashed border-opacity-25 my-3" thickness="1"/>
               <div v-if="totalTickets > 0" class="d-flex flex-column">
                  <div v-for="item in ticketOrder" :key="item.ticketId" class="d-flex flex-column">
                     <span class="font-weight-bold">{{ item.title }}</span>
                     <div class="d-flex flex-row align-center justify-space-between">
                        <span class="text-sm">{{ item.qty }} Ticket</span>
                        <span class="text-sm font-weight-bold">Rp. {{ parseInt(item.amount).toLocaleString("id-ID") }}</span>
                     </div>
                     <VDivider class="border-dashed border-opacity-25 my-2" thickness="1" />
                  </div>
                  <div class="d-flex flex-row justify-space-between mb-4 mt-2">
                     <span class="text-sm font-weight-bold">Total {{ totalTickets }} ticket</span>
                     <span class="text-sm font-weight-bold">Rp. {{ parseInt(totalAmount).toLocaleString("id-ID") }}</span>
                  </div>
               </div>
               <div v-else class="mb-4">
                  <span class="text-sm align-self-center text-center">You still haven't decided on a ticket. On the Ticket Menu Tab, please choose First.</span>
               </div>
               <v-btn variant="tonal" rounded="lg" @click="handleBtn">
                  <span class="font-weight-bold">Buy Ticket</span>
               </v-btn>
            </v-card>
            <v-card v-else class="pa-4 rounded-lg mt-5 d-flex flex-column">
               <span class="text-sm align-self-center text-center">This event is not published yet.</span>
            </v-card>
         </v-col>
      </v-row>
   </div>
</template>

<script setup>
   import moment from "moment";
   import { useEventStore } from "@/stores/eventStore";
   import { useOrderStore } from "@/stores/orderStore";
   import { useNotifStore } from "@/stores/notifStore";

   const route = useRoute();
   const eventStore = useEventStore();
   const orderStore = useOrderStore();
   const notifStore = useNotifStore();
   const router = useRouter();
   const tickets = ref([]);
   const currentTab = ref(0);
   const loading = ref(false);

   const data = computed(() => {
      return eventStore.eventDetails
   })

   const totalTickets = computed(() => {
      return orderStore.totalTickets
   })

   const ticketOrder = computed(() => {
      return orderStore.ticketOrder
   })

   const totalAmount = computed(() => {
      return orderStore.ticketOrder.length > 0 ? orderStore.ticketOrder.reduce((accumulator, item) => accumulator + item.amount, 0) : 0;
   })

   const getData = async (id) => {
      try {
         loading.value = true;
         await eventStore.resetDetails();
         await orderStore.resetOrder();
         const response = await eventStore.getEventById(id);
         const filtered = response.tickets.length > 0 ? response.tickets.map(data => ({...data, qty: 0, amount: 0})) : [];
         tickets.value = filtered;
      } finally {
         loading.value = false;
      }
   }

   const handleBtn = () => {
      if (orderStore.totalTickets > 0) {
         router.push(`/order`)
      } else {
         notifStore.setSnackbar("warning", "Select at least 1 ticket!", true);
      }
   }

   // when mounted call getData function
   onMounted(() => {
      getData(route.params.id);
   })
</script>