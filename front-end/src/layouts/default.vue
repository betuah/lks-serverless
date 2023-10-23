<script lang="ts" setup>
import { useSkins } from "@core/composable/useSkins";
import { useThemeConfig } from "@core/composable/useThemeConfig";

const MainLayout = defineAsyncComponent(
   () => import("./components/MainLayout.vue")
);

const { width: windowWidth } = useWindowSize();
const { switchToVerticalNavOnLtOverlayNavBreakpoint } = useThemeConfig();

// ℹ️ This will switch to vertical nav when define breakpoint is reached when in horizontal nav layout
// Remove below composable usage if you are not using horizontal nav layout in your app
switchToVerticalNavOnLtOverlayNavBreakpoint(windowWidth);

const { layoutAttrs, injectSkinClasses } = useSkins();

injectSkinClasses();
</script>

<template>
   <MainLayout v-bind="layoutAttrs" />
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
