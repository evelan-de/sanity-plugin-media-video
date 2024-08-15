# Sanity Plugin Media Video

A Sanity plugin for adding a media object (Image/Video) to your sanity studio schemas and displaying the media with built-in functionalities such as auto-play, custom PiP on scroll, etc.

> This is a **Sanity Studio v3** plugin.

## Installation

```sh
npm install sanity-plugin-media-video
```

## Usage

Add it as a plugin in sanity.config.ts (or .js):

### Basic configuration
```ts
// sanity.config.ts

import { defineConfig } from 'sanity';
import { mediaVideoPlugin } from 'sanity-plugin-media-video';

export default defineConfig({
  //...
  plugins: [
    // ...other plugins
    mediaVideoPlugin(),
  ],
});
```

Add it as a `type` to one of your defined fields like so:

```ts
export default defineType({
  name: 'my-section',
  title: 'My Example Section',
  type: 'object',
  fields: [
    // ...your-other-fields
    defineField({
      name: 'my-custom-media-field',
      title: 'My Custom Media Field',
      type: 'media',
    }),
    // ...your-other-fields
  ],
});
```

## License

[MIT](LICENSE) © Evelan

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.
