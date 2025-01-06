<script setup>
// Imports
import Experience from "~/assets/js/Voronoi/Experience.js";

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
  <main class="min-h-screen bg-zinc-950">
    <canvas
      ref="canvasRef"
      class="absolute inset-0 h-screen w-screen"
    />
  </main>
</template>
