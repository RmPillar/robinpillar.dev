import glsl from "vite-plugin-glsl";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  postcss: {
    plugins: {
      "postcss-import": {},
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
      "postcss-pxtorem": {},
    },
  },
  css: ["~/assets/css/styles.css"],
  modules: ["@nuxt/eslint"],
  eslint: {
    checker: {
      lintOnStart: false,
      emitError: false, // optional
      emitWarning: false, // optional
    },
  },
  vite: {
    plugins: [glsl()],
  },
});
