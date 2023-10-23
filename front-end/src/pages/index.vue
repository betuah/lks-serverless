<template>
   <div class="d-flex flex-column ma-3">
      <span class="text-h4 font-weight-black mb-4">| Upcoming Events</span>
      <div>
         <v-row>
            <v-col v-if="loading && eventStore.events.length == 0" col="12">
               <div class="d-flex flex-column justify-center align-center my-10">
                  <span class="text-center text-sm">Loading events...</span>
                  <div class="v-col-md-2 v-col-8">
                     <VProgressLinear
                        indeterminate
                        rounded
                        height="2"
                        color="primary"
                     />
                  </div>
               </div>
            </v-col>
            <v-col v-if="eventStore.events.length == 0 && !loading" col="12">
               <div class="d-flex flex-column justify-center align-center">
                  <span class="my-10 font-italic font-weight-medium">Sorry, No event available.</span>
               </div>
            </v-col>
            <v-col v-for="event in eventStore.events" col="12" md="4" :key="event.eventId">
               <EventCatalog v-if="event.publish"
                  :id="event.eventId"
                  :title="event.title" 
                  :date="event.date" 
                  price="165000" 
                  :location="event.location"
                  :image="event.image"
               />
            </v-col>
         </v-row>
      </div>
   </div>
</template>

<script setup>
   import { useEventStore } from "@/stores/eventStore";

   const eventStore = useEventStore();
   const loading = ref(false);
   const getData = async () => {
      try {
         loading.value = true;
         await eventStore.getEvents();
      } finally {
         loading.value = false;
      }
   }

   // when mounted call getData function
   onMounted(async () => {
      getData();
   })
</script>
