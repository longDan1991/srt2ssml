<template>
  <RouterView :key="routerKey" />
</template>
<script setup>
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const routerKey = computed(() => route.fullPath);
</script>
<style scoped></style>
