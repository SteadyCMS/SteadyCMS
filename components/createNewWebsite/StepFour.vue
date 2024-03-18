<script setup>
import { ref } from 'vue';

const props = defineProps(['websiteInfo']);

</script>

<template>
  <div class="flex flex-col">
    <div class="w-full mt-10">
      <div class="flex flex-grow align-center justify-between">
        <h1 class="text-4xl text-tint-10 font-bold">Review your website setup.</h1>
      </div>
    </div>

    <div class="mt-8 text-tint-10 space-y-3">
      <p>Website name: {{ props.websiteInfo.website }}</p>
      <p>Template: {{ props.websiteInfo.template }}</p>
      <p>Output path: {{ props.websiteInfo.path }}</p>
    </div>

  </div>
</template>