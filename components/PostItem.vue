<script setup>
  import { ref } from 'vue';
  
  import ThreeDotsIcon from './icons/ThreeDotsIcon.vue';
  import TrashIcon from './icons/TrashIcon.vue';

  const props = defineProps(['posts', 'item', 'pathToImages', 'showPostExcerpt']);
  const emit = defineEmits(['goToBlockEditor', 'deletePost']);
  const showOptionsMenu = ref(false);

</script>

<template>
  <div class="group flex duration-300 ease-in-out w-full"> 
    <div class="flex flex-row items-start justify-between w-full">
      <div @click="$emit('goToBlockEditor', props.item.name)" class="flex items-center w-full">
        <div class="bg-cover bg-center bg-tint-1 w-28 h-20 rounded-lg" :style="'background-image: url(' + props.pathToImages + props.item.featuredImage + ')'"></div>
        <div class="flex flex-col ml-5">
          <h4 class="flex items-center text-xl text-tint-10 font-medium">
            <span class="group-hover:underline duration-300 ease-in-out">{{ props.item.title }}</span>
            <span class="text-base text-tint-8 ml-1 font-medium">&mdash; 
              <span v-if="props.item.postStatus == 'draft'">Draft</span> 
              <span v-if="props.item.postStatus == 'published'">Published</span>
              <span v-if="props.item.postStatus == 'tobepublished'">To Be Published</span>
              
            </span>
          </h4>
          <p class="text-xs text-tint-7 mt-1">{{ props.item.date }}</p>
          <p class="text-tint-8 mt-1.5 max-w-2xl truncate text-sm" :class="{'hidden': !props.showPostExcerpt}">{{ props.item.text }}</p>
        </div>
      </div>
      <button @click="showOptionsMenu = !showOptionsMenu" class="p-4">
        <ThreeDotsIcon class="fill-tint-9 w-5 h-5" />
      </button>
      <div v-if="showOptionsMenu" class="absolute right-4 top-10 my-4 w-48 list-none rounded-lg bg-white text-base z-50 shadow-sm">
        <ul class="py-1 w-full">
          <li @click="$emit('deletePost', props.item.name, props.posts, props.item)" class="flex flex-row items-center text-error font-medium text-sm cursor-pointer rounded-md px-3 py-2 ease-in-out duration-300 hover:bg-tint-1">
            <TrashIcon class="fill-error w-5 h-5 mr-2" /> Delete post
          </li>
        </ul>
      </div> 
    </div> 
  </div>
</template>