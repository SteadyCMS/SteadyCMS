<script setup>
import { ref } from 'vue';

const webName = ref("");
defineEmits(['onChange']);
const props = defineProps(['name', 'isValid', 'errorText']);
webName.value = props.name;
</script>

<template>
  <div class="flex flex-col">
    <div class="w-full mt-10">
      <div class="flex flex-col flex-grow align-center justify-between">
        <h1 class="text-4xl text-tint-10 font-bold">Choose a name for your new website.</h1>
        <p class="text-tint-8 mt-2">
          What would you like to call your website? This is so you can indentify your website
          in the dashboard.
        </p>
      </div>
    </div>

    <div class="flex flex-col mt-8">
      <input type="text" v-model="webName" maxlength="40" @input="$emit('onChange', webName)"
        placeholder="Your website name" :class="{ 'border-error': !props.isValid, 'border-tint-2': props.isValid }"
        class="outline-none rounded-lg border-solid border focus:border-accent placeholder:text-tint-6 text-base py-3 px-4 max-w-md duration-300" />
      <small v-if="!props.isValid" class="text-error mt-1">
        {{ props.errorText }}
      </small>
    </div>
  </div>
</template>