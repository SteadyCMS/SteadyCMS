<script setup>
  import { ref } from 'vue'
  import {openModal} from '@kolirt/vue-modal'
  import mediaDialog from '../../components/mediaDialog.vue'

  // Outside 
  const props =  defineProps(['item']);

  function showMediaDialog() {
  openModal(mediaDialog, {
      title: 'Select Or Upload Media',
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
      <span @click="showMediaDialog" class="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-50 file:text-blue-600
      hover:file:bg-blue-100">Choose a photo</span>

      <img :src="props.item.src">
    </div>
    <input type="text" placeholder="Enter Caption..." v-model="props.item.caption" 
    class="mt-1 px-2 py-1 block w-full bg-white outline-none border-0 border-none text-md placeholder-slate-400"/>
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















