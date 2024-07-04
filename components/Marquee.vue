<script setup>
// Props
const props = defineProps({
  body: {
    type: String,
    default: "",
  },
  gap: {
    type: Number,
    default: 30,
  },
  speed: {
    type: Number,
    default: 60,
  },
  scrub: {
    type: [Boolean, Number],
    default: false,
  },
  disableOnMobile: {
    type: Boolean,
    default: false,
  },
});

// Composables
const { duplicates, marqueeRef, initMarquee } = useMarquee({ speed: props.speed, gap: props.gap });

// Lifecycle Hooks
onMounted(() => {
  if (props.disableOnMobile && window.innerWidth < 768) return;

  initMarquee(marqueeRef.value);
});
</script>

<template>
  <div
    ref="marqueeRef"
    class="gap-x-30 flex"
  >
    <div
      v-for="(item, index) in duplicates"
      :key="index"
      class="gap-x-30 flex"
    >
      <h1 class="font-mosk text-[28rem] font-black uppercase text-gray-900">{{ body }}</h1>

      <span class="bg-blue lg:w-38 my-auto block h-10 w-12 rounded-full lg:mx-40 lg:h-28" />
      <h1 class="font-mosk text-[28rem] font-black uppercase text-gray-900">{{ body }}</h1>

      <span class="bg-blue lg:w-38 my-auto block h-10 w-12 rounded-full lg:mx-40 lg:h-32" />
    </div>
  </div>
</template>
