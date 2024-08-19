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

    <div class="lg:bottom-50 lg:left-50 absolute bottom-36 left-36 flex items-center gap-20 lg:gap-28">
      <a
        href="https://github.com/RmPillar"
        target="_blank"
      >
        <SvgGithub class="lg:w-50 lg:min-w-50 block w-36 min-w-36 text-zinc-50" />
      </a>

      <a href="mailto:robin@robinpillar.dev">
        <SvgEmail class="block w-40 min-w-40 text-zinc-50 lg:w-60 lg:min-w-60" />
      </a>
    </div>
  </main>
</template>

<style lang="postcss">
body {
  overscroll-behavior: none;
}
</style>
