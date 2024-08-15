import { definePlugin } from 'sanity';

import mediaObject from '../schemas/objects/MediaObject';
import { MediaVideoPluginOptions } from '../types/MediaVideoPluginOptions';
import {
  DEFAULT_RESOURCE_BUNDLE,
  DEFAULT_RESOURCE_BUNDLE2,
} from '../utils/i18n/resourceBundles';

export const mediaVideoPlugin = definePlugin<void | MediaVideoPluginOptions>(
  (config) => {
    return {
      name: `sanity-plugin-media-video`,
      schema: {
        types: [mediaObject(config)],
      },
      i18n: {
        bundles: [
          {
            namespace: 'schema',
            resources: [DEFAULT_RESOURCE_BUNDLE, DEFAULT_RESOURCE_BUNDLE2],
          },
        ],
      },
    };
  },
);
