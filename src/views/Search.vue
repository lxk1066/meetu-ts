<script lang="ts">
export default { name: "meetuSearch" };
</script>
<script setup lang="ts" name="meetuSearch">
import { ref } from "vue";
const name = ref("search");
</script>

<template>
  <h2>{{ name }}</h2>
</template>

<style scoped></style>
