import { z } from 'zod';

/**
 * Asset structure from Sanity. Used for Sanity Image.
 *
 * @note update type as you use more properties
 */
export const sanityImage = z.object({
  asset: z
    .object({
      _id: z.string(),
      metadata: z
        .object({
          lqip: z.string(),
        })
        .optional()
        .nullable(),
      url: z.string().url(),
    })
    .optional(),
  crop: z
    .object({
      _type: z.literal('sanity.imageCrop').optional().nullable(),
      bottom: z.number().optional().nullable(),
      left: z.number().optional().nullable(),
      right: z.number().optional().nullable(),
      top: z.number().optional().nullable(),
    })
    .optional()
    .nullable(),
  hotspot: z
    .object({
      _type: z.literal('sanity.imageHotspot').optional().nullable(),
      height: z.number().optional().nullable(),
      width: z.number().optional().nullable(),
      x: z.number().optional().nullable(),
      y: z.number().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export const sanityImageWithAlt = z
  .object({
    _id: z.string(),
    altText: z.string().optional().nullable(),
  })
  .merge(sanityImage);

export type SanityImageType = z.infer<typeof sanityImageWithAlt>;
