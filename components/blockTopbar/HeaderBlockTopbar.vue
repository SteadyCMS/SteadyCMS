<script setup>
  import H2Icon from '../icons/HeadingIcons/H2Icon.vue';
  import H3Icon from '../icons/HeadingIcons/H3Icon.vue';
  import H4Icon from '../icons/HeadingIcons/H4Icon.vue';
  import H5Icon from '../icons/HeadingIcons/H5Icon.vue';
  import H6Icon from '../icons/HeadingIcons/H6Icon.vue';

  const props =  defineProps(['item']);
  defineEmits(['sizeChanged'])
</script>

<template>
  <div>
    <button @click="$emit('sizeChanged', 'h2', props.item )" :class="{ 'bg-tint-1': props.item.headingType == 'h2' }"
    class="hover:bg-tint-1 p-1 rounded-md duration-300">
        <H2Icon class="fill-tint-8 w-6 h-6" :class="{ 'fill-tint-10': props.item.headingType == 'h2' }" />
    </button>

    <button @click="$emit('sizeChanged', 'h3', props.item )" :class="{ 'bg-tint-1': props.item.headingType == 'h3' }"
    class="hover:bg-tint-1 p-1 rounded-md duration-300">
        <H3Icon class="fill-tint-8 w-6 h-6" :class="{ 'fill-tint-10': props.item.headingType == 'h3' }"/>
    </button> 

    <button @click="$emit('sizeChanged', 'h4', props.item )" :class="{ 'bg-tint-1': props.item.headingType == 'h4' }"
    class="hover:bg-tint-1 p-1 rounded-md duration-300">
        <H4Icon class="fill-tint-8 w-6 h-6" :class="{ 'fill-tint-10': props.item.headingType == 'h4' }"/>
    </button>

    <button @click="$emit('sizeChanged', 'h5', props.item )" :class="{ 'bg-tint-1': props.item.headingType == 'h5' }"
    class="hover:bg-tint-1 p-1 rounded-md duration-300">
        <H5Icon class="fill-tint-8 w-6 h-6" :class="{ 'fill-tint-10': props.item.headingType == 'h5' }"/>
    </button>

    <button @click="$emit('sizeChanged', 'h6', props.item )" :class="{ 'bg-tint-1': props.item.headingType == 'h6' }"
    class="hover:bg-tint-1 p-1 rounded-md duration-300">
        <H6Icon class="fill-tint-8 w-6 h-6" :class="{ 'fill-tint-10': props.item.headingType == 'h6' }"/>
    </button>
  </div>
</template>