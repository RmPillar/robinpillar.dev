<script setup>
// Imports
import FontFaceObserver from "fontfaceobserver";
import gsap from "gsap";

// Template Refs/Reactives
const loaderRef = ref(null);

onMounted(() => {
  const fontBiggerDisplay = new FontFaceObserver("BiggerDisplay");

  Promise.all([fontBiggerDisplay.load()]).then(() => {
    gsap.to(loaderRef.value, {
      autoAlpha: 0,
      duration: 1,
    });
  });
});
</script>

<template>
  <div
    ref="loaderRef"
    class="fixed inset-0 z-50 h-full w-full bg-zinc-100"
  />
</template>
