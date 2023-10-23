<template>
   <v-card class="rounded-lg" @click="$router.push(`/event/${id}`)">
      <VImg
         :src="image"
         cover
         :aspect-ratio="16/7"
      />

      <div class="pa-4 d-flex flex-column">
         <span class="text-md text-primary font-weight-bold my-1">{{ title || "-" }}</span>
         <span class="text-sm mb-2 font-weight-medium">{{ moment(date).format("DD MMM YYYY") }}</span>
         <VDivider class="my-2" />
         <div class="d-flex flex-row align-start justify-start">
            <VIcon size="18" icon="tabler-building-skyscraper" />
            <span class="pl-2 text-sm font-weight-medium">{{ location || "-" }}</span>
         </div>
      </div>
   </v-card>
</template>

<script setup>
import moment from "moment";

const prop = defineProps({
   id: {
      type: String,
      required: true,
      default: "#"
   },
   title: {
      type: String,
      required: true,
   },
   date: {
      type: String,
      required: true,
   },
   image: {
      type: String,
      required: true,
      default: "banner-event.jpg"
   },
   location: {
      type: String,
      required: false,
   },
});
</script>