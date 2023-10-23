<script setup>
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
</script>

<template>
   <v-card class="px-5 py-2 rounded-lg">
      <!-- <div class="d-flex flex-row align-center">
         <div class="d-flex">
            <span class="text-h1 font-weight-black">SW</span>
            <div class="d-flex flex-column justify-center ml-1">
               <span class="text-caption">SoundWave</span>
               <span class="text-lg font-weight-bold">Productions</span>
            </div>
         </div>
         <v-spacer />
         <NavbarThemeSwitcher class="me-1" />
         <VBadge dot :modelValue="false">
            <IconBtn :size="32">
               <VIcon size="20" icon="tabler-bell" />
               <VTooltip
                  activator="parent"
                  open-delay="1000"
                  scroll-strategy="close"
               >
                  <span class="text-capitalize text-caption"
                     >Notification</span
                  >
               </VTooltip>
            </IconBtn>
         </VBadge>
      </div> -->
      <div class="d-flex flex-column">
         <span>SW Production</span>
         <span class="text-sm text-justify">
            We're your premier music promoter, dedicated to unforgettable concert experiences. With decades of experience, we're the top choice for music lovers seeking remarkable moments. Explore our user-friendly website for concert info, quick ticket purchases, and reliable customer service. Join us in celebrating the power of music.
         </span>
      </div>
   </v-card>
</template>