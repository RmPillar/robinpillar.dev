<template>
  <section
    class="page-imageGallery flex h-screen w-screen cursor-pointer items-center"
    @click="changeImage"
    @mousemove="createRipple"
  >
    <div
      v-for="(heading, index) in headings"
      ref="headingsRef"
      :key="index"
      class="page-imageGallery__heading left-6/12 top-6/12 -translate-x-6/12 -translate-y-6/12 absolute z-10 w-full"
    >
      <h1
        v-splitText
        class="font-argesta text-center text-[100px] uppercase leading-[90px] text-gray-50 lg:text-[200px] lg:leading-[180px]"
        v-text="heading"
      />
    </div>

    <div class="px-30 absolute bottom-20 left-20 z-10 flex flex-col bg-gray-50/10 py-20 text-xl text-white backdrop-blur-2xl">
      Inspiration:
      <a
        target="_blank"
        class="text-base"
        href="https://homunculus.jp/"
        >https://homunculus.jp/</a
      >
      <a
        target="_blank"
        class="text-base"
        href="https://havenstudios.com"
        >https://havenstudios.com</a
      >
    </div>

    <canvas
      ref="canvasRef"
      class="pointer-events-none fixed inset-0 h-full w-full"
    />
  </section>
</template>

<script>
import Experience from "~/assets/js/ImageGallery/Experience/Experience";
export default {
  data() {
    return {
      headings: ["Image Gallery", "Title Two", "Title Three", "Title Four"],
    };
  },
  mounted() {
    if (this.experience) {
      return;
    }
    this.experience = new Experience(this.$refs.canvasRef, this.$refs.headingsRef);
  },
  beforeUnmount() {
    this.experience.destroy();
    this.experience = null;
  },
  methods: {
    changeImage() {
      if (this.experience) {
        this.experience.changeImage();
      }
    },
    createRipple(e) {
      if (this.experience) {
        this.experience.createRipple(e);
      }
    },
  },
};
</script>

<style lang="postcss">
.page-imageGallery {
  &__heading {
    .word {
      overflow: hidden;
    }
    .char {
      transform: translateY(100%);
      transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      transition-delay: calc(var(--char-index) * 0.02s);
    }

    &.active {
      .char {
        transform: translateY(0);
      }
    }
  }
}
</style>
