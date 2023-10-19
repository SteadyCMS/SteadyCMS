<script setup>
import {closeModal, confirmModal} from '@kolirt/vue-modal'

const props = defineProps({
  title: {},
  message: {},
  acceptText: "Confirm",
  declineText: "Close",
  cancelText: "Cancel"
})












</script>
<template>
  <SimpleModal :title='props.title' size="xxl" >
    <div class="flex flex-col overflow-scroll max-h-full">









    </div>

    <template #footer>
      <button @click="confirmModal({accepted: true})" class="">
         {{ props.acceptText }}
      </button>
      <button @click="confirmModal({accepted: false})" class="">
        {{ props.declineText }}
      </button>
      <button @click="closeModal()" class="">
        {{ props.cancelText }}
      </button>
    </template>
  </SimpleModal>
</template>