import { defineConfig } from '@sanity/pkg-utils';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import path from 'path';

export default defineConfig({
  dist: 'dist',
  tsconfig: 'tsconfig.dist.json',

  // Add Rollup configuration with PostCSS
  rollup: {
    plugins: [
      postcss({
        extensions: ['.css', '.scss'],
        extract: path.resolve('dist/sanity-plugin-media-video.css'),
        minimize: true, // Minify the CSS
        plugins: [
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
