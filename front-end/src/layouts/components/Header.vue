<script setup>
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import router from "@/router";

const active = ref(1)

const to = (path) => {
   switch (path) {
      case "/":
         active.value = 1;
         router.push(path);
         break;
      case "/about":
         active.value = 2;
         router.push(path);
         break;
      case "#contact":
         active.value = 3;
         router.push(path);
         break;
   }
}
</script>

<template>
   <v-card class="pa-2 px-5 rounded-lg">
      <v-row >
         <v-col col="12" md="6">
            <div class="d-flex flex-row align-center">
               <span class="text-h1 font-weight-black">SW</span>
               <div class="d-flex flex-column justify-center ml-2">
                  <span class="text-caption">SoundWave</span>
                  <span class="text-lg font-weight-bold">Productions</span>
               </div>
               <VSpacer class="d-flex d-md-none" />
               <div class="d-flex d-md-none">
                  <NavbarThemeSwitcher />
               </div>
            </div>
         </v-col>
         <VDivider class="border-dashed d-flex d-md-none" />
         <v-col col="12" md="6" class="pt-0 pb-2 pa-md-3">
            <div class="d-flex flex-row align-center justify-center justify-md-end">
               <VList class="d-flex flex-row justify-end align-center">
                  <VListItem :active="active.value == 1" rounded="lg" variant="plain" @click="to('/')" class="font-weight-medium">Home</VListItem>
                  <VListItem :active="active.value == 2" rounded="lg" variant="plain" @click="to('/about')" class="font-weight-medium">About</VListItem>
               </VList>
               <NavbarThemeSwitcher class="d-none d-md-flex" />
            </div>
         </v-col>
      </v-row>
   </v-card>
</template>