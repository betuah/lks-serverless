<script setup>
import { ref } from "vue-demi";

const props = defineProps({
   visible: {
      type: Boolean,
      default: false,
      required: true,
   },
   id: {
      type: String,
      required: false,
   },
   timer: {
      type: Number,
      default: 10,
      required: false,
   },
   onConfirm: {
      type: Function,
      required: true,
   },
});

let intervalId;
const isLoading = ref(false);
const countdown = ref(props.timer);
const startCountdown = () => {
   intervalId = setInterval(() => {
      countdown.value--;
      if (countdown.value === 0) {
         clearInterval(intervalId);
         dialogModelValueUpdate(false);
      }
   }, 1000);
};

const stopCountdown = () => {
   countdown.value = props.timer;
   clearInterval(intervalId);
};

watch(
   () => props.visible,
   (newVal) => {
      if (newVal) {
         startCountdown();
      } else {
         stopCountdown();
      }
   }
);

const emit = defineEmits(["update:visible"]);

const confirm = async () => {
   isLoading.value = true;

   try {
      await props.onConfirm(props.id);
   } catch (e) {
   } finally {
      isLoading.value = false;
   }
};

const dialogModelValueUpdate = (val) => {
   emit("update:visible", val);
};
</script>

<template>
   <VDialog
      :width="$vuetify.display.smAndDown ? 'auto' : 400"
      :model-value="props.visible"
      @update:model-value="dialogModelValueUpdate"
   >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

      <VCard class="px-6 pt-6 pb-3 rounded-lg">
         <!-- 👉 Title -->
         <div class="d-flex flex-column pt-8 pt-md-0">
            <span class="text-h5 font-weight-medium text-start">
               Are you sure to delete this data ?
            </span>
            <span class="text-body-2 mt-3"
               >Your data will be permanently delete and cannot be undone!</span
            >
            <span class="text-caption mt-5"
               >This action will close in
               <span class="text-secondary font-weight-bold">{{
                  countdown
               }}</span>
               seconds.</span
            >
         </div>

         <VDivider class="my-4 my-md-3" />

         <v-card-actions class="d-flex flex-row justify-end">
            <VBtn
               color="disabled"
               variant="tonal"
               @click="dialogModelValueUpdate(false)"
            >
               <v-progress-circular
                  :model-value="(countdown / props.timer) * 100"
                  :rotate="360"
                  width="1"
                  size="25"
                  class="text-caption text-disabled mr-1"
						color="disabled"
               >
                  {{ countdown }}
               </v-progress-circular>
               Close
            </VBtn>
            <VBtn variant="elevated" color="error" @click="confirm">
               Confirm
            </VBtn>
         </v-card-actions>
      </VCard>
   </VDialog>
</template>
