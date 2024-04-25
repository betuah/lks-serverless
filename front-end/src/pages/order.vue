<template>
   <div>
      <div v-if="!ws.isConnected" class="px-3 py-10 d-flex flex-column justify-center align-center">
         <span>Connecting to websocket. If this takes too long, please refresh the page.</span>
      </div>
      <div v-else>
         <VForm
            ref="refForm"
            @submit.prevent
         >
            <VProgressLinear
               v-if="loading"
               indeterminate
               rounded
               height="2"
               color="primary"
            />
            <v-row class="px-3 mb-4 mt-2">
               <v-col cols="12" md="8">
                  <div class="d-flex flex-column">
                     <v-card flat class="px-5 py-3 d-flex flex-column rounded-lg mb-2 border border-2 border-opacity-25">
                        <span class="text-md font-weight-bold">Order Details</span>
                        <VDivider class="border-dashed border-opacity-25 my-3" thickness="1" />
                        <v-row no-gutters class="my-3">
                           <v-col>
                              <v-card flat class="rounded-lg">
                                 <VImg :aspect-ratio="14/6" cover :src="event.image"/>
                              </v-card>
                           </v-col>
                           <v-col class="pa-0 pl-4">
                              <span class="text-lg font-weight-bold">{{ event.title }}</span>
                              <div class="d-flex align-center text-md font-weight-medium mt-3">
                                 <VIcon :size="18" icon="tabler-calendar" />
                                 <span class="ml-2">{{ moment(event.date).format("DD MMMM YYYY") }}</span>
                              </div>
                              <div class="d-flex align-center text-md font-weight-medium">
                                 <VIcon :size="18" icon="tabler-tag" />
                                 <span class="ml-2">{{ event.category }}</span>
                              </div>
                              <div class="d-flex align-center text-md font-weight-medium">
                                 <VIcon :size="18" icon="tabler-map-pin" />
                                 <span class="ml-2">{{ event.location }}</span>
                              </div>
                           </v-col>
                        </v-row>
                        <VDivider class="border-dashed border-opacity-25 my-3" thickness="1" />
                        <v-row no-gutters>
                           <v-col col="8">
                              <span class="font-weight-bold">Item</span>
                           </v-col>
                           <v-col col="2">
                              <div class="d-flex justify-end">
                                 <span class="font-weight-bold">Amount</span>
                              </div>
                           </v-col>
                           <v-col col="1">
                              <div class="d-flex justify-end">
                                 <span class="font-weight-bold">Quantity</span>
                              </div>
                           </v-col>
                        </v-row>
                        <VDivider class="border-dashed border-opacity-25 my-3" thickness="1" />
                        <v-row v-for="item in orders" :key="item.ticketId" no-gutters class="mb-2">
                           <v-col col="8">
                              <span class="text-sm font-weight-medium">{{ item.title }}</span>
                           </v-col>
                           <v-col col="3">
                              <div class="d-flex justify-end">
                                 <span class="text-sm font-weight-medium">Rp. {{ parseInt(item.amount).toLocaleString("id-ID") }}</span>
                              </div>
                           </v-col>
                           <v-col col="1">
                              <div class="d-flex justify-end">
                                 <span class="text-sm font-weight-medium">{{ item.qty }}x</span>
                              </div>
                           </v-col>
                        </v-row>
                     </v-card>
                     <v-card flat class="px-5 py-3 d-flex flex-column rounded-lg mt-4 border border-2 border-opacity-25">
                        <div class="mb-3">
                           <span class="font-weight-bold text-md">Personal Information</span>
                           <VDivider class="border-dashed border-opacity-20 my-3" />
                           <v-row no-gutters="" class="mt-2">
                              <v-col cols="12" class="mt-1">
                                 <AppTextField
                                    v-model="personalData.fullName"
                                    label="Full Name*"
                                    density="compact"
                                    placeholder="Full name according to identity card"
                                    :rules="[(val) => !!val || 'Full Name is required']"
                                 />
                              </v-col>
                              <v-col cols="12" class="mt-3">
                                 <AppTextField
                                    v-model="personalData.email"
                                    label="Email*"
                                    density="compact"
                                    placeholder="Active email"
                                    hint="E-Ticket and order details will be sent to your email"
                                    :rules="[requiredValidator, emailValidator]"
                                 />
                              </v-col>
                              <v-col cols="12" class="mt-3">
                                 <AppTextField
                                    v-model="personalData.phone"
                                    label="Phone*"
                                    density="compact"
                                    placeholder="Your whatapp number"
                                    hint="This number is used for alternative notifications"
                                    :rules="[requiredValidator, integerValidator]"
                                 />
                              </v-col>
                           </v-row>
                        </div>
                     </v-card>
                     <!-- <v-card flat class="px-5 py-3 d-flex flex-column rounded-lg mt-4 border border-2 border-opacity-25">
                        <span class="text-md font-weight-bold">Payment Method</span>
                        <span class="text-sm font-italic">Select bank transfer bellow</span>
                        <div class="mt-2">
                           <CustomRadiosWithImage
                              v-model:selected-radio="payment.bank"
                              :radio-content="propertyRadioContent"
                              :grid-column="{ cols: '12', sm: '4' }"
                           />
                        </div>
                     </v-card> -->
                  </div>
               </v-col>
               <v-col cols="12" md="4" class="px-3">
                  <v-card class="pa-4 rounded-lg d-flex flex-column">
                     <!-- <span class="text-lg font-weight-black">#548293</span>
                     <span class="text-caption font-italic font-weight-bold text-error">
                        Please save this order number to pay later.
                     </span> -->
                     <!-- <VDivider class="border-dashed border-opacity-25 my-3" thickness="1" /> -->
                     <span class="text-h5 font-weight-black">Pricing Details</span>
                     <div class="d-flex flex-row justify-space-between align-center mt-3 font-weight-medium">
                        <span>Total Amount</span>
                        <span>Rp {{ parseInt(totalAmount).toLocaleString("id-ID") }}</span>
                     </div>
                     <div class="d-flex flex-row justify-space-between align-center mt-3 font-weight-medium">
                        <span>Unique Number</span>
                        <span>Rp {{ uniqueNumber }}</span>
                     </div>
                     <VDivider class="border-dashed border-opacity-25 my-3" thickness="1" />
                     <div class="d-flex flex-row justify-space-between align-center mt-3 font-weight-bold mb-4">
                        <span>Total payment</span>
                        <span class="text-lg">Rp {{ parseInt(totalAmount + uniqueNumber).toLocaleString("id-ID") }}</span>
                     </div>
                     <v-btn variant="tonal" rounded="lg" :loading="loading" @click="submit" :disabled="loading">
                        <span class="font-weight-bold">Pay for Tickets</span>
                     </v-btn>
                     <PaymentQueue v-model="isDialogShow" :totalAmount="totalAmount + uniqueNumber" />
                  </v-card>
               </v-col>
            </v-row>
         </VForm>
      </div>
   </div>
</template>

<script setup>
import moment from "moment";
import { useEventStore } from "@/stores/eventStore";
import { useOrderStore } from "@/stores/orderStore";
import { emailValidator, requiredValidator, integerValidator } from '@validators'
import { useWebsocket } from '@/stores/websocketStore';

const ws = useWebsocket();
const eventStore = useEventStore();
const orderStore = useOrderStore();
const router = useRouter();
const isDialogShow = ref(false);
const loading = ref(false);
const refForm = ref();
const personalData = reactive({
   fullName: "",
   email: "",
   phone: "",
})
const payment = reactive({
   type: "transfer",
   bank: "mandiri" // Mandiri & Jago
})

const uniqueNumber = computed(() => {
   return Math.floor(Math.random() * 600) + 100;
})

const propertyRadioContent = [
   {
      title: 'Bank Mandiri',
      bgImage: "/mandiri.png",
      value: 'mandiri',
   },
   {
      title: 'Bank Jago',
      bgImage: "/jago.png",
      value: 'jago',
   },
]

const event = computed(() => {
   return eventStore.eventDetails
})

const orders = computed(() => {
   return orderStore.ticketOrder
})

const totalAmount = computed(() => {
   const orders = orderStore.ticketOrder
   return orders.length > 0 ? orders.reduce((accumulator, item) => accumulator + item.amount, 0) : 0;
})


const submit = async () => {
   const { valid } = await refForm.value?.validate();

   if (valid) {
      try {
         loading.value = true
         const tickets = orderStore.ticketOrder.map(i => ({ ticketId: i.ticketId, qty: i.qty }));
         const rawBody = {
            connectionId: ws.connectionId,
            data: {
               ...personalData,
               eventId: eventStore.eventDetails.eventId,
               bank: payment.bank,
               items: tickets
            }
         };

         console.log('Connection ID: ', ws.connectionId)

         const res = await orderStore.createOrder(rawBody);
         isDialogShow.value = res ? res : false;
      } finally {
         loading.value = false
      }
   }
}

onMounted(() => {
   // getData(route.params.id);
   if (eventStore.eventDetails.eventId == "") {
      router.go(-1);
   }

   ws.connect();
})
</script>