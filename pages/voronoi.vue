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
  <main class="bg-gray-100">
    <div class="absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 rotate-3">
      <Marquee
        body="Voronoi"
        :speed="120"
      />
    </div>
    <canvas
      ref="canvasRef"
      class="absolute inset-0 h-screen w-screen"
    />
  </main>
</template>
