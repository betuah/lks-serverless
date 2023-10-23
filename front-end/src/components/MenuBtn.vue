<template>
   <div class="">
      <v-hover v-slot="{ isHovering, props }">
         <div class="d-flex flex-column h-100" v-bind="props">
            <div
               style="width: 120px; height: 100%"
               :style="
                  prop.isActive || isHovering
                     ? 'border-color:rgb(var(--v-theme-primary)) !important'
                     : ''
               "
               :class="
                  prop.isActive || isHovering
                     ? 'border'
                     : 'border border-dashed'
               "
               class="d-flex flex-column justify-center align-center cursor-pointer rounded-lg px-5 pt-4 pb-3 my-2 mx-2 h-100"
            >
               <VAvatar
                  rounded="lg"
                  :size="avatarSize"
                  :color="prop.isActive || isHovering ? 'primary' : 'secondary'"
                  :variant="prop.iconVariant"
                  class="mb-2"
               >
                  <VIcon :icon="`tabler-${prop.icon}`" :size="prop.iconSize" />
               </VAvatar>
               <div class="mb-0 text-center">
                  <span
                     :class="`text-body-2 font-weight-medium ${
                        isHovering ? 'text-primary' : 'text-default'
                     }`"
                     >{{ prop.title }}</span
                  >
               </div>
            </div>
         </div>
      </v-hover>
   </div>
</template>

<script setup>
const prop = defineProps({
   title: {
      type: String,
      required: true,
   },
   isActive: {
      type: Boolean,
      required: false,
      default: false,
   },
   icon: {
      type: String,
      required: true,
   },
   iconVariant: {
      type: String,
      required: false,
      enum: ["tonal", "elevated", "outlined", "flat", "plain", "text"],
      default: "text",
   },
   iconSize: {
      type: Number,
      required: false,
      default: 25,
   },
});

// const emits = defineEmits(["click"]);
const avatarSize = computed(() => {
   const result = prop.iconSize + 20;
   return result;
});

// const handleClick = () => {
//    emits.click(); // Emit event 'click'
// };
</script>
