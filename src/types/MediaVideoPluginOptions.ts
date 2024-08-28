import { z } from 'zod';

// Define the Zod schema for MediaVideoPluginOptions
export const mediaVideoPluginOptionsSchema = z.object({
  isImageRequired: z.boolean().default(true).optional(),
});

// Infer the type from the Zod schema
export type MediaVideoPluginOptions = z.infer<
  typeof mediaVideoPluginOptionsSchema
>;
