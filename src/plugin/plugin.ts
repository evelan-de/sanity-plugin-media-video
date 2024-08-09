import { definePlugin } from 'sanity';

import MediaObject from '../schemas/objects/MediaObject';

export const MediaVideoPlugin = definePlugin<void>(() => {
  return {
    name: `sanity-plugin-media-video`,
    schema: {
      types: [MediaObject()],
    },
  };
});
