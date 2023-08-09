<script lang="ts">
export default { name: "meetuMatch" };
</script>
<script setup lang="ts" name="meetuMatch">
import { ref } from "vue";
const name = ref("match");
</script>

<template>
  <h2>{{ name }}</h2>
</template>

<style scoped></style>
