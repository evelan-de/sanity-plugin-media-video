import { defineConfig } from '@sanity/pkg-utils';
import postcss from 'rollup-plugin-postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';

export default defineConfig({
  dist: 'dist',
  tsconfig: 'tsconfig.dist.json',
  rollup: {
    plugins: [
      // Add your own rollup plugins here
      postcss({
        extract: false,
        minimize: true,
        config: {
          ctx: '',
          path: './postcss.config.js',
        },
        plugins: [tailwindcss(), autoprefixer()],
      }),
    ],
  },

  // Remove this block to enable strict export validation
  extract: {
    rules: {
      'ae-forgotten-export': 'off',
      'ae-incompatible-release-tags': 'off',
      'ae-internal-missing-underscore': 'off',
      'ae-missing-release-tag': 'off',
    },
  },
});
