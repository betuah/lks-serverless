<script lang="ts" setup>
import { useThemeConfig } from "@core/composable/useThemeConfig";
import Footer from "./Footer.vue";
import Header from "./Header.vue";
import Snackbar from "./Snackbar.vue";

const router = useRouter();
const { appRouteTransition, isLessThanOverlayNavBreakpoint } = useThemeConfig();
const { width: windowWidth } = useWindowSize();
const backHome = () => router.push("/");
</script>

<template>
   <v-container class="fill-height">
      <v-row justify="center" class="">
         <Snackbar />
         <v-col cols="12" md="10">
            <Header />
         </v-col>
         <v-col cols="12" md="10" class="pa-0">
            <RouterView v-slot="{ Component }">
               <Transition :name="appRouteTransition" mode="out-in">
                  <Component :is="Component" />
               </Transition>
            </RouterView>
         </v-col>
         <v-col col="12" md="10">
            <v-card class="pa-5 rounded-lg">
               <Footer />
            </v-card>
         </v-col>
      </v-row>
   </v-container>
</template>
