<script setup>
import { reactive } from "vue";
import { usePermisStore } from "@/stores/permissionStore";
import { useNotifStore } from "@/stores/notifStore";

const props = defineProps({
   visible: {
      type: Boolean,
      required: true,
   },
   fetchData: {
      type: Function,
      required: true,
   },
});

const notifStore = useNotifStore();
const permisStore = usePermisStore();
const isLoading = ref(false);
const form = ref();
const formData = reactive({
   permissionId: "",
   desc: "",
   action: "",
   subject: "",
});

const emit = defineEmits(["update:visible", "submit"]);

const resetForm = () => {
   formData.permissionId = "";
   formData.action = "";
   formData.desc = "";
   formData.desc = "";
   formData.subject = "";
   emit("update:visible", false);
};

const onFormSubmit = () => {
   form.value?.validate().then(({ valid: isValid }) => {
      if (isValid) {
         addData();
      }
   });
};

const addData = async () => {
   isLoading.value = true;

   try {
      await permisStore.addPermission({
         permissionId: formData.permissionId,
         desc: formData.desc,
         action: formData.action,
         subject: formData.subject,
      });

      await props.fetchData();
      notifStore.setSnackbar("success", "Adding new permission success.", true);
      resetForm();
   } catch (e) {
   } finally {
      isLoading.value = false;
   }
};

const dialogModelValueUpdate = (val) => {
   resetForm();
   emit("update:visible", val);
};
</script>

<template>
   <VDialog
      :width="$vuetify.display.smAndDown ? 'auto' : 550"
      :model-value="props.visible"
      @update:model-value="dialogModelValueUpdate"
   >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

      <VCard class="pa-sm-9 pa-20 rounded-lg">
         <!-- 👉 Title -->
         <div class="d-flex flex-column pt-8 pt-md-0">
            <span class="text-h5 text-center"> Add Permission </span>
            <!-- 👉 Subtitle -->
            <p class="text-center text-caption">
               Add permission for the system
            </p>
         </div>

         <VDivider class="my-4 my-md-3" />

         <div class="pa-3">
            <!-- 👉 Form -->
            <VForm ref="form" @submit.prevent="onFormSubmit">
               <VRow no-gutters>
                  <v-col cols="12">
                     <VTextField
                        v-model="formData.permissionId"
                        label="Permission ID"
                        density="compact"
                        :rules="[(val) => !!val || 'Permission ID is required']"
                     />
                  </v-col>
                  <v-col cols="12" class="mt-3">
                     <VTextField
                        v-model="formData.action"
                        label="Action"
                        density="compact"
                        :rules="[(val) => !!val || 'Action is required']"
                     />
                  </v-col>
                  <v-col cols="12" class="mt-3">
                     <VTextField
                        v-model="formData.subject"
                        label="Subject"
                        density="compact"
                        :rules="[(val) => !!val || 'Subject is required']"
                     />
                  </v-col>
                  <v-col cols="12" class="mt-3">
                     <VTextarea
                        v-model="formData.desc"
                        label="Description"
                        density="compact"
                        rows="3"
                        :rules="[(val) => !!val || 'Description is required']"
                     />
                  </v-col>

                  <VDivider class="mt-6 mb-4" />

                  <VCol cols="12" class="text-center mb-md-0">
                     <VBtn
                        type="submit"
                        class="me-3"
                        :loading="isLoading"
                        :disabled="isLoading"
                        >Submit
                     </VBtn>

                     <VBtn variant="tonal" color="secondary" @click="resetForm">
                        Cancel
                     </VBtn>
                  </VCol>
               </VRow>
            </VForm>
         </div>
      </VCard>
   </VDialog>
</template>
