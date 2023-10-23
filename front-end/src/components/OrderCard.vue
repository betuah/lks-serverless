<template>
   <v-card class="pa-3 mt-3 rounded-lg">
      <v-row no-gutters align="center">
         <v-col cols="5">
            <div class="d-flex flex-column">
               <div
                  class="text-caption font-italic font-weight-bold text-disabled"
               >
                  <span class="">#14476 </span>
               </div>
               <span class="text-h5 font-weight-bold">{{
                  props.fullName
               }}</span>
               <span class="text-disabled text-caption font-italic"
                  >27 July 2023 (4 hour ago)</span
               >
            </div>
         </v-col>
         <v-col cols="2">
            <div class="d-flex flex-column">
               <span class="text-caption text-disabled font-italic">Item</span>
               <span class="text-body-2 font-weight-bold">{{
                  props.item
               }}</span>
            </div>
         </v-col>
         <v-col cols="2">
            <div class="d-flex flex-column">
               <span class="text-caption text-disabled font-italic"
                  >Total Amount</span
               >
               <span class="text-body-2 font-weight-bold"
                  >Rp {{ parseInt(props.total).toLocaleString("ID") }}</span
               >
            </div>
         </v-col>
         <v-col cols="2">
            <div class="d-flex flex-column">
               <span class="text-caption text-disabled font-italic"
                  >Status</span
               >
               <div>
                  <v-chip
                     variant="outlined"
                     :color="handleStatus(props.status).color"
                     size="x-small"
                  >
                     <span class="text-caption">{{
                        handleStatus(props.status).status
                     }}</span>
                  </v-chip>
               </div>
            </div>
         </v-col>
         <v-col cols="1">
            <div class="d-flex flex-row align-center justify-end">
               <VBtn icon size="26" color="default" variant="text">
                  <VIcon size="16" icon="tabler-file-upload" />
                  <VTooltip location="top" activator="parent">
                     <span class="text-caption">Upload Payment </span>
                  </VTooltip>
               </VBtn>
               <VBtn icon size="26" color="error" variant="text">
                  <VIcon size="16" icon="tabler-trash" />
                  <VTooltip location="top" activator="parent">
                     <span class="text-caption">Delete </span>
                  </VTooltip>
               </VBtn>
            </div>
         </v-col>
      </v-row>
   </v-card>
</template>

<script setup>
const props = defineProps({
   orderId: {
      type: Number,
      required: true,
   },
   fullName: {
      type: String,
      required: true,
   },
   item: {
      type: String,
      required: true,
   },
   total: {
      type: Number,
      required: true,
   },
   date: {
      type: String,
      required: true,
   },
   status: {
      type: String,
      required: true,
   },
});

const handleStatus = (request) => {
   let color = "default";
   let status = "Waiting Payment";

   switch (request) {
      case "waiting":
         color = "warning";
         status = "Waiting Payment";
         break;

      case "validating":
         color = "warning";
         status = "Validation";
         break;

      case "invalid":
         color = "error";
         status = "Invalid";
         break;

      case "success":
         color = "success";
         status = "Success";
         break;

      default:
         color = "warning";
         status = "Waiting Payment";
         break;
   }

   return {
      color,
      status,
   };
};
</script>
