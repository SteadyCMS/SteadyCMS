<script setup>
  import { closeModal, confirmModal } from '@kolirt/vue-modal';
  import { isNotEmpty } from '../../utils/utils';
  import { ref } from 'vue';

  const props = defineProps({
    title: {},
    message: {},
    acceptText: "Enter",
    declineText: "Go to settings",
    cancelText: "Cancel",
    enterPasswordDialog: false,
    serverInfoList: {}
  });

  const password = ref('');
  const passwordIsNotValid = ref(false);
  const title = (props.enterPasswordDialog) ? "Password Required" : "Missing Server Information";

  function checkInput() {
    passwordIsNotValid.value = !isNotEmpty(password.value);
  }
</script>
<template>
  <SimpleModal :title='title' size="sm">

    <div v-if="enterPasswordDialog == true">
        <p  class="text-tint-10 max-w-md text-lg my-3">
        Server Password required:
        </p>
        <input @change="checkInput" type="password" v-model="password">
    </div>

    <div v-if="enterPasswordDialog == false">
        <p class="text-tint-10 max-w-md text-lg my-3">
            Missing important server information. Please enter the missing information in settings and try again.
        </p>
        <div>
            <p>Host: <span>{{ serverInfoList.host }}</span></p>
            <p>Username: <span>{{ serverInfoList.username }}</span></p>
            <p>Password: <span>{{ serverInfoList.password }}</span></p>
            <p>Port: <span>{{ serverInfoList.port }}</span></p>
        </div>
    </div>

    <template #footer>
       <div class="flex flex-row justify-between w-full">
        <button @click="confirmModal({accepted: false, cancel: true})" class="py-2 px-4 font-medium text-sm">
          {{ props.cancelText }}
        </button>
        <div class="flex space-x-2">
          <button  v-if="enterPasswordDialog == false" @click="confirmModal({accepted: false, cancel: false})" class="py-2 px-4 text-white hover:text-white/80 bg-black hover:bg-black text-sm font-medium rounded-lg ease-in-out duration-300">
            {{ props.declineText }}
          </button>
          <button  
          v-if="enterPasswordDialog == true" 
          :disabled='passwordIsNotValid'
          @click="confirmModal({accepted: true, cancel: false, serverPassword: password})" 
          class="py-2 px-4 text-white hover:text-white/80 bg-black hover:bg-black text-sm font-medium rounded-lg ease-in-out duration-300">
         {{ props.acceptText }}
          </button>
        </div>
      </div> 
    </template>
  </SimpleModal>
</template>