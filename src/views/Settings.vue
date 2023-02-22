<template>
  <Upload v-model="formState.logo" :maxWidth="600" :maxHeight="600" />
</template>
<script setup>
import { reactive } from "vue";

const formState = reactive({});
</script>
<style scoped></style>
