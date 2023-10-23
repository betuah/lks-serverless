<template>
   <div class="shadow-none pa-5 border-2 border-primary border-dashed rounded-lg mt-3">
      <div class="d-flex flex-column">
         <div class="d-flex flex-row justify-space-between align-center mb-2">
            <span class="text-lg font-weight-bold">{{ title}}</span>
         </div>
         <span class="text-sm">{{ desc || "No description." }}</span>
      </div>
      <VDivider class="border-dashed border-opacity-25 my-3" :thickness="1" />
      <div class="d-flex flex-row justify-space-between align-center">
         <span class="text-md font-weight-bold">{{
            price ? "Rp " + parseInt(price).toLocaleString("id-ID") : "Free"
         }}</span>
         <div>
            <VChip variant="outlined" color="success" size="small">
               <span class="text-sm"><span class="font-weight-bold mr-1">{{ qty }}</span> Ticket Available.</span>
            </VChip>
         </div>
      </div>
   </div>
</template>

<script setup>
const qty = ref(0)

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
      default: "No description.",
   },
   qty: {
      type: String,
      required: true,
   },
   price: {
      type: String,
      required: true,
   }
})
</script>