import { z } from 'zod';

// Define the Zod schema for MediaTranslationSchema
// export const mediaTranslationSchema = z.object({
//   imageTitle: z.string().optional(),
//   imageDescription: z.string().optional(),
//   imageRequiredTitle: z.string().optional(),
//   imageAltTextTitle: z.string().optional(),
//   imageAltTextTitleDescription: z.string().optional(),
//   enableVideoTitle: z.string().optional(),
//   enableVideoDescription: z.string().optional(),
//   videoTypeTitle: z.string().optional(),
//   videoTypeDescription: z.string().optional(),
//   videoTypeLinkTitle: z.string().optional(),
//   videoTypeRequiredTitle: z.string().optional(),
//   isAutoPlayTitle: z.string().optional(),
//   isAutoPlayDescription: z.string().optional(),
//   isPipAutomaticTitle: z.string().optional(),
//   isPipAutomaticDescription: z.string().optional(),
//   videoUrlTitle: z.string().optional(),
//   videoUrlDescription: z.string().optional(),
//   videoUrlRequiredTitle: z.string().optional(),
//   muxVideoTitle: z.string().optional(),
//   muxVideoDescription: z.string().optional(),
//   muxVideoRequiredTitle: z.string().optional(),
// });

// // Infer the type from the Zod schema
// export type MediaTranslationSchema = z.infer<typeof mediaTranslationSchema>;

// Define the Zod schema for MediaVideoPluginOptions
export const mediaVideoPluginOptionsSchema = z.object({
  isImageRequired: z.boolean().default(true).optional(),
});

// Infer the type from the Zod schema
export type MediaVideoPluginOptions = z.infer<
  typeof mediaVideoPluginOptionsSchema
>;
// & {
//   translationSchemaBundles?: LocalesBundlesOption;
// };
