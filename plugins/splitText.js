import gsap from "gsap";
import { SplitText } from "gsap/dist/SplitText";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("splitText", {
    mounted(el, binding) {
      gsap.registerPlugin(SplitText);

      const options = binding.value || {
        type: "words,chars",
        charsClass: "char",
        wordsClass: "word",
      };
      const text = new SplitText(el, options);

      text.chars.forEach((char, index) => {
        char.style.setProperty("--char-index", index);
      });
    },
  });
});
