<script setup>
const props = defineProps(['text']);
</script>

<template>
  <button
    class="py-3 px-6 bg-white text-tint-10 border border-tint-2 text-sm font-semibold rounded-lg ease-in-out duration-500">
    {{ props.text }}
  </button>
</template>