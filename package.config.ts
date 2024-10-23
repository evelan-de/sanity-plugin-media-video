import { defineConfig } from '@sanity/pkg-utils';
import postcss from 'rollup-plugin-postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';

export default defineConfig({
  dist: 'dist',
  tsconfig: 'tsconfig.dist.json',

  // Add Rollup configuration with PostCSS and Tailwind
  rollup: {
    plugins: [
      postcss({
        extract: path.resolve('dist/sanity-plugin-media-video.module.css'),
        minimize: true, // Minify the CSS
        plugins: [
          tailwindcss(),
          autoprefixer(), // Ensures CSS is compatible across different browsers
        ],
        autoModules: true, // Automatically import CSS modules
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
