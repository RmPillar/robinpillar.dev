module.exports = {
  root: true,
  extends: ['@nuxt/eslint-config', 'prettier'],
  rules: {
    'no-undef': 'off',
    'no-unused-vars': 'off', // personal preference
    '@typescript-eslint/no-unused-vars': 'off',
    'vue/no-v-html': 'off',

    // ideally you should enable these rules, but old projects will complain

    // 'vue/multi-word-component-names': ['error', {
    //   ignores: ['Nav', 'Menu', 'Footer']
    // }],
    // 'vue/multi-word-component-names': 'off',
    // 'vue/no-reserved-component-names': 'off',
  },
  ignorePatterns: ["dist", "node_modules", ".output", ".nuxt"],
};
