<template>
  <div class="relative flex h-screen w-screen items-center justify-center bg-gray-100">
    <h1 class="heading-xl uppercase text-gray-900">Particles</h1>
    <canvas
      ref="canvasRef"
      class="webgl absolute inset-0 h-full w-full"
    />
  </div>
</template>

<script>
import Experience from "~/assets/js/Particles/Experience.js";
export default {
  data() {
    return {
      experience: null,
    };
  },
  mounted() {
    this.experience = new Experience(this.$refs.canvasRef);
  },
  beforeUnmount() {
    this.experience.destroy();
  },
};
</script>
