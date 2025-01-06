<script setup>
  import { closeModal, confirmModal } from '@kolirt/vue-modal';

  const props = defineProps({
    title: {},
    message: {},
    acceptText: "Confirm",
    declineText: "Close",
    cancelText: "Cancel"
  })
</script>

<template>
  <SimpleModal :title='props.title' size="sm">
    <p class="text-tint-10 max-w-md text-lg my-3">{{ props.message }}</p>
    <template #footer>
      <div class="flex flex-row justify-between w-full">
        <button @click="confirmModal({accepted: false, cancel: true})" class="py-2 px-4 font-medium text-sm">
          {{ props.cancelText }}
        </button>
        <div class="flex space-x-2">
          <button @click="confirmModal({accepted: false, cancel: false})" class="py-2 px-4 text-sm font-medium text-error">
            {{ props.declineText }}
          </button>
          <button @click="confirmModal({accepted: true, cancel: false})" class="py-2 px-4 text-white hover:text-white/80 bg-black hover:bg-black text-sm font-medium rounded-lg ease-in-out duration-300">
         {{ props.acceptText }}
          </button>
        </div>
      </div>
    </template>
  </SimpleModal>
</template>