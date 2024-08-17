<script setup>
// Imports
import Experience from "~/assets/js/Demo/Experience.js";

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
  <main class="min-h-screen bg-zinc-900">
    <canvas
      ref="canvasRef"
      class="absolute inset-0 h-screen w-screen"
    />

    <div class="bottom-50 left-50 absolute flex items-center gap-28">
      <a
        href="https://github.com/RmPillar"
        target="_blank"
      >
        <SvgGithub class="w-50 min-w-50 block text-zinc-50" />
      </a>

      <a href="mailto:robin@robinpillar.dev">
        <SvgEmail class="block w-60 min-w-60 text-zinc-50" />
      </a>
    </div>
  </main>
</template>

<style lang="postcss">
body {
  overscroll-behavior: none;
}
</style>
