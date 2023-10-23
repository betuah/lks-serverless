<template>
   <VSnackbar
      v-model="visible"
      transition="scroll-y-reverse-transition"
      location="top center"
      variant="flat"
      :timeout="3500"
      :color="status"
      rounded="lg"
   >
      <div class="d-flex flex-row align-center">
         <v-avatar variant="tonal" color="white" size="30">
            <v-icon size="20" :icon="icon"></v-icon>
         </v-avatar>
         <div class="d-flex flex-column">
            <span class="ml-3 text-sm">{{ message }} </span>
         </div>
      </div>

      <template #actions>
         <VBtn
            icon
            size="x-small"
            color="white"
            @click="hiddeError"
            class="no-blur"
            ><v-icon size="16" color="white" icon="tabler-x"></v-icon>
         </VBtn>
      </template>
   </VSnackbar>
</template>

<script>
import { useNotifStore } from "@/stores/notifStore";
const notifStore = useNotifStore();

export default {
   computed: {
      status: {
         get() {
            return notifStore.status;
         },
      },
      message: {
         get() {
            return notifStore.message;
         },
      },
      visible: {
         // getter
         get() {
            return notifStore.visible;
         },
         // setter
         set(newValue) {
            notifStore.hide();
         },
      },
      icon: {
         get() {
            switch (this.status) {
               case "success":
                  return "tabler-circle-check";

               default:
                  return "tabler-alert-circle";
            }
         },
      },
   },
   methods: {
      hiddeError() {
         return notifStore.hide();
      },
   },
};
</script>
