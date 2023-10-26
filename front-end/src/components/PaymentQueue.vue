<script setup>
import { useWebsocket } from '@/stores/websocketStore';
import { useOrderStore } from '@/stores/orderStore';
import { watch } from 'vue';

const props = defineProps({
   modelValue: {
      type: Boolean,
      required: true,
   },
   totalAmount: {
      type: Number,
      required: true,
   }
})

const ws = useWebsocket();
const orderStore = useOrderStore();
const router = useRouter();
const queue = ref(true);
const tqMessage = ref(false);
const file = ref(null);
const base64Image = ref(null);
const loading = ref(false);
const countDown = ref(10);
let countdownInterval;
const rules = [(fileList) => !fileList || !fileList.length || fileList[0].size < 1000000 || 'Avatar size should be less than 1 MB!']
const emit = defineEmits(["update:modelValue", "submit"]);

const dialogModelValueUpdate = (val) => {
   // resetForm();
   emit("update:modelValue", val);
};

watch(() => ws.message, (val) => {
   if (val === 'OK') {
      queue.value = false
   }
});

watch(() => props.modelValue, (val) => {
   if (val) {
      queue.value = val;
      base64Image.value = null;
      file.value = null;
      ws.message = "";
      tqMessage.value = false;
   }
});

const submit = async () => {
   loading.value = true;
   const type = file.value[0].type;
   let ext = 'jpg';

   if (type === 'image/jpeg') {
      ext = 'jpg';
   } else if (type === 'image/png') {
      ext = 'png';
   }

   try {
      const res = await orderStore.uploadPayment(base64Image.value, ext, type);
      if (res) {
         queue.value = false;
         base64Image.value = null;
         file.value = null;
         base64Image.value = null;
         tqMessage.value = true;

         countDown.value = 10;
         clearInterval(countdownInterval);
         startCountdown();
      }
   } finally {
      loading.value = false
   }
}

const handleFileUpload = (e) => {
   convertToBase64(e.target.files[0]);
};

const convertToBase64 = (file) => {
   const reader = new FileReader();
   reader.onload = (e) => {
      base64Image.value = e.target.result;
   };
   reader.readAsDataURL(file);
};

const startCountdown = () => {
   countdownInterval = setInterval(() => {
      countDown.value--;

      if (countDown.value === 0) {
         clearInterval(countdownInterval);
         router.push('/');
      }
   }, 1000);
};
</script>

<template>
      <VDialog
         :model-value="props.modelValue"
         width="500"
         persistent
         @update:model-value="dialogModelValueUpdate"
      >
         <!-- Dialog close btn -->
         <DialogCloseBtn @click="dialogModelValueUpdate(false)" />
      
         <!-- Dialog Content -->
         <VCard >
            <VCardText class="d-flex flex-column">
               <span class="text-h4 font-weight-bold">Payment</span>
               <VDivider class="border-dashed border-opacity-25 my-3" thickness="1" />
               <div v-if="queue && !tqMessage" class="d-flex flex-column justify-center align-center py-5">
                  <VProgressCircular
                     :size="50"
                     width="3"
                     color="primary"
                     indeterminate
                  />
                  <span class="mt-5 text-center text-md font-weight-medium">
                     You're currently in the queue, please wait for the payment.
                  </span>
                  <span class="text-center font-italic text-sm text-error font-weight-bold">Do not close this page.</span>
               </div>
               <div v-if="!queue && !tqMessage" class="d-flex flex-column">
                  <span class="text-sm">Please transfer your payment to this account and upload your payment.</span>
                  <div class="text-md d-flex flex-column my-2 pa-3 border border-dashed border-opacity-25 rounded-lg">
                     <span>MANDIRI</span>
                     <span>9345637421000</span>
                     <span class="font-weight-bold">Amount : Rp {{ parseInt(totalAmount).toLocaleString("id-ID") }}</span>
                  </div>
                  <span class="text-sm text-error font-italic">Please transfer the exact amount, no more or no less.</span>
                  <VDivider class="border-dashed border-opacity-25 my-3" thickness="1" />
                  <span class="text-sm mb-2">Upload your payment here</span>
                  
                     <VFileInput 
                        v-model="file" 
                        label="Prof Of Payment" 
                        prepend-icon="tabler-camera" 
                        accept="image/png, image/jpeg" 
                        :rules="rules" 
                        @change="handleFileUpload"
                     />
                  
               </div>
               <div v-if="tqMessage" class="d-flex flex-column align-center justify-center pt-10 pb-5 text-md">
                  <span class="mb-5 font-weight-black text-h1">{{ countDown }}</span>
                  <span class="font-weight-bold text-success">Payment Succesful.</span>
                  <span>Thank you and see you on the stage 😉. Cheers!! 🍻</span>
                  <span class="font-italic text-sm mt-10">This page will be closed automatically.</span>
               </div>
            </VCardText>
      
            <VCardText v-if="!queue && !tqMessage" class="d-flex justify-end">
               <VBtn @click="submit" :loading="loading" :disabled="loading">
                  Submit
               </VBtn>
            </VCardText>

            <VCardText v-if="tqMessage" class="d-flex justify-end">
               <VBtn @click="router.push('/')" color="disabled">
                  Close
               </VBtn>
            </VCardText>
         </VCard>
      </VDialog>
</template>