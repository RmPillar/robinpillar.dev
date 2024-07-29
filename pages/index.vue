<script setup>
// Imports
import Experience from "~/assets/js/Landing/Experience.js";

// Template Refs
const canvasRef = ref(null);

// Reactives
const experience = ref(null);

// Lifecycle Hooks
onMounted(() => {
  if (!canvasRef.value) return;

  experience.value = new Experience(canvasRef.value);
});

onBeforeUnmount(() => {
  if (!experience.value) return;

  experience.value.destroy();
});
</script>

<template>
  <main class="min-h-screen bg-zinc-50">
    <div class="absolute bottom-[60px] left-[60px] z-10 flex">
      <span class="mr-1 lg:text-lg 2xl:text-xl">Email: </span>
      <a
        class="text-zinc-950 hover:underline lg:text-lg 2xl:text-xl"
        href="mailto:robin@robinpillar.dev"
        >robin@robinpillar.dev</a
      >
    </div>

    <canvas
      ref="canvasRef"
      class="absolute inset-0 h-screen w-screen"
    />
  </main>
</template>
