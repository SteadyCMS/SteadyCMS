<script setup>
  import { ref } from 'vue';
  import {openModal} from '@kolirt/vue-modal';
  import mediaDialog from '../MediaDialog.vue';

  import ImagesSquareIcon from '../icons/ImagesSquareIcon.vue';

  // Outside 
  const props =  defineProps(['item']);

  function showMediaDialog() {
  openModal(mediaDialog, {
      title: 'Select media',
      message: '',
      acceptText: 'Select',
      declineText: 'x',
      cancelText: '_'
  })
      // runs when modal is closed via confirmModal
      .then((data) => {
       // console.log('success', data.accepted)
       // console.log("selected", data.selected)
        props.item.src = data.selectedPath;
      })
      // runs when modal is closed via closeModal or esc
      .catch(() => {
        console.log('catch')
      });
}

</script>
<template>
  <div class="flex flex-col">
    <div class="flex flex-col">
      <img :src="props.item.src">
      <button @click="showMediaDialog" class="mt-1 cursor-pointer flex flex-row space-x-2 items-center py-2 px-4 text-white hover:text-white/80 fill-white hover:fill-white/80 bg-black hover:bg-black text-sm font-medium rounded-lg ease-in-out duration-300 w-fit">
        <ImagesSquareIcon class="w-5 h-5 mr-1"/>
        Select image
      </button>
    </div>
    <input type="text" placeholder="Type caption..." v-model="props.item.caption" class="mt-1 px-2 py-1 block italic w-full bg-white outline-none border-0 border-none text-sm placeholder-tint-6 placeholder:italic"/>
  </div>
</template>

<!--
    {{< figure src="/posts/racoons.jpg" alt="Racoons" caption="We caught a family of racoons raiding our kitchen area" >}}
    {
       "type": "image", 
       "caption": "", 
       "src": "", 
       "id": "39139299103", 
       "alt": "",
       "active": false, 
       "menu": false, 
       "focus": false 
    },
--> 
