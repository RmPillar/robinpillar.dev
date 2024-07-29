<script setup>
useHead({
  title: "Robin Pillar: Creative Developer",
  meta: [{ name: "description", content: "Hi I'm Robin, and this is my portfolio. Here, I share the new things I am learning about on shaders, ThreeJS and everything Frontend Development" }],
});
</script>

<template>
  <main class="landing-page flex min-h-screen flex-col items-center justify-center bg-zinc-100">
    <div class="container flex flex-col items-center justify-center py-20">
      <h1 class="heading text-center text-zinc-800">ROBIN PILLAR</h1>
      <h2 class="subheading mb-8 text-zinc-800">CREATIVE DEVELOPER</h2>
      <a
        class="font-biggerDisplay group relative block px-4 py-3 text-xl tracking-wider xl:px-8 xl:py-6 xl:text-4xl"
        href="mailto:robin@robinpillar.dev"
      >
        <span class="relative block overflow-hidden">
          <span class="block transition-transform duration-500 ease-in-out group-hover:-translate-y-full"> GET IN TOUCH </span>
          <span class="absolute left-1/2 top-full w-full -translate-x-1/2 transition-transform duration-500 ease-in-out group-hover:-translate-y-full"> GET IN TOUCH </span>
        </span>
        <span class="button-border absolute border-2 border-zinc-800 transition-transform duration-500 ease-in-out group-hover:scale-110 xl:border-4" />
      </a>
    </div>
  </main>
</template>

<style lang="postcss">
.landing-page {
  .heading {
    @apply font-biggerDisplay;

    font-size: clamp(84px, 23vw, 144px);
    line-height: 1;

    @media screen(lg) {
      font-size: clamp(213px, 20.8vw, 400px);
    }
  }

  .subheading {
    @apply font-biggerDisplay;

    font-size: clamp(36px, 10vw, 65px);
    line-height: 1;

    @media screen(lg) {
      font-size: clamp(51px, 5vw, 96px);
    }
  }

  .button-border {
    top: -2px;
    right: -2px;
    bottom: -2px;
    left: -2px;

    width: calc(100% + 4px);
    height: calc(100% + 4px);

    @media screen(xl) {
      top: -4px;
      right: -4px;
      bottom: -4px;
      left: -4px;

      width: calc(100% + 8px);
      height: calc(100% + 8px);
    }
  }
}
</style>
