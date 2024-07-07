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
    class="flex gap-x-32"
  >
    <div
      v-for="(item, index) in duplicates"
      :key="index"
      class="flex gap-x-32"
    >
      <h1 class="font-mosk text-[28rem] font-black uppercase text-gray-900">{{ body }}</h1>

      <h1 class="font-mosk text-[28rem] font-black uppercase text-gray-900">{{ body }}</h1>
    </div>
  </div>
</template>
