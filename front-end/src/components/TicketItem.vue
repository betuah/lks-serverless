<template>
   <div class="shadow-none pa-5 border-2 border-primary border-dashed rounded-lg mt-3">
      <div class="d-flex flex-column">
         <div class="d-flex flex-row justify-space-between align-center mb-2">
            <span class="text-lg font-weight-bold">{{ title }}</span>
            <VChip variant="outlined" color="success" size="small">
               <span class="text-caption"><span class="font-weight-bold mr-1">{{ stock }}</span> Ticket Available.</span>
            </VChip>
         </div>
         <span class="text-sm">{{ desc || "No description." }}</span>
      </div>
      <VDivider class="border-dashed border-opacity-25 my-3" :thickness="1" />
      <div class="d-flex flex-row justify-space-between align-center">
         <span class="text-md font-weight-bold">{{
            price ? "Rp " + parseInt(price).toLocaleString("id-ID") : "Free"
         }}</span>
         <div>
            <VBtn size="18" icon variant="outlined" @click="handleDecrement">
               <VIcon
                  icon="tabler-minus"
                  size="14"
               />
            </VBtn>
            <span class="text-md mx-4">{{ qty }}</span>
            <VBtn size="18" icon variant="outlined" @click="handleIncrement">
               <VIcon
                  icon="tabler-plus"
                  size="14"
               />
            </VBtn>
         </div>
      </div>
   </div>
</template>

<script setup>
import { useOrderStore } from "@/stores/orderStore";
import { computed } from "vue";

const props = defineProps({
   id: {
      type: String,
      required: false,
   },
   title: {
      type: String,
      required: true,
   },
   desc: {
      type: String,
      required: true,
      default: "No description available.",
   },
   stock: {
      type: Number,
      required: true,
      default: 0
   },
   price: {
      type: Number,
      required: true,
   },
   // increment: {
   //    type: Function,
   //    required: true,
   // },
   // decrement: {
   //    type: Function,
   //    required: true,
   // }
})
const orderStore = useOrderStore();
// const qty = ref(0);

const qty = computed(() => {
   const existingItem = orderStore.ticketOrder.find(item => item.ticketId === props.id);
   return existingItem?.qty || 0;
})

const handleIncrement = () => {
   if (orderStore.totalTickets < 4 && props.stock > 0) {
      orderStore.addOrderItem(props.id);
   }
}

const handleDecrement = () => {
   const existingItem = orderStore.ticketOrder.find(item => item.ticketId === props.id);
   const currentQty = existingItem?.qty || 0;

   if (currentQty > 0) {
      orderStore.removeOrderItem(props.id);
   }
}
</script>