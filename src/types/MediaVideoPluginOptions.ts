import { z } from 'zod';

import { DEFAULT_SCHEMA_RESOURCE } from '../utils/i18n/resourceBundles';

// Define the Zod schema for MediaVideoPluginOptions
export const mediaVideoPluginOptionsSchema = z.object({
  isImageRequired: z.boolean().default(true).optional(),
});

// Infer the type from the Zod schema
export type MediaVideoPluginOptions = z.infer<
  typeof mediaVideoPluginOptionsSchema
> & {
  translationSchema?: (typeof DEFAULT_SCHEMA_RESOURCE)['schema'];
};
