import { z } from 'zod';

/**
 * Asset structure from Sanity. Used for Sanity Image.
 *
 * @note update type as you use more properties
 */
const sanityImage = z.object({
  asset: z
    .object({
      _id: z.string(),
      metadata: z
        .object({
          lqip: z.string(),
        })
        .optional(),
      url: z.url(),
    })
    .optional()
    .nullable(),
  crop: z
    .object({
      _type: z.literal('sanity.imageCrop').optional(),
      bottom: z.number().optional(),
      left: z.number().optional(),
      right: z.number().optional(),
      top: z.number().optional(),
    })
    .optional()
    .nullable(),
  hotspot: z
    .object({
      _type: z.literal('sanity.imageHotspot').optional(),
      height: z.number().optional(),
      width: z.number().optional(),
      x: z.number().optional(),
      y: z.number().optional(),
    })
    .optional()
    .nullable(),
});

const sanityImageWithAlt = z
  .object({
    altText: z.string().optional().nullable(),
  })
  .extend(sanityImage.shape);

export type SanityImageType = z.infer<typeof sanityImageWithAlt>;

const videoTypeEnum = z.enum(['link', 'mux']);

export type VideoType = z.infer<typeof videoTypeEnum>;

// #region Mux Video schema
// Schema for playback ID
const playbackIdSchema = z.object({
  id: z.string().optional().nullable(),
  policy: z.enum(['public', 'signed']).optional().nullable(),
});

// Schema for tracks
const trackSchema = z.object({
  max_channel_layout: z.string().optional().nullable(),
  max_channels: z.number().optional().nullable(),
  id: z.string().optional().nullable(),
  type: z.enum(['audio', 'video']).optional().nullable(),
  primary: z.boolean().optional().nullable(),
  duration: z.number().optional().nullable(),
  max_frame_rate: z.number().optional().nullable(),
  max_height: z.number().optional().nullable(),
  max_width: z.number().optional().nullable(),
});

// Schema for the 'data' field
const dataSchema = z.object({
  encoding_tier: z.string().optional().nullable(),
  max_resolution_tier: z.string().optional().nullable(),
  aspect_ratio: z.string().optional().nullable(),
  created_at: z.string().optional().nullable(),
  duration: z.number().optional().nullable(),
  status: z.enum(['preparing', 'ready', 'errored']).optional().nullable(),
  master_access: z.string().optional().nullable(),
  max_stored_frame_rate: z.number().optional().nullable(),
  playback_ids: z.array(playbackIdSchema).optional().nullable(),
  resolution_tier: z.string().optional().nullable(),
  ingest_type: z.string().optional().nullable(),
  max_stored_resolution: z.string().optional().nullable(),
  tracks: z.array(trackSchema).optional().nullable(),
  id: z.string().optional().nullable(),
  mp4_support: z.string().optional().nullable(),
});

// Schema for the main structure
const muxVideoAsset = z.object({
  _id: z.string().optional().nullable(),
  _type: z.literal('mux.videoAsset').optional().nullable(),
  assetId: z.string().optional().nullable(),
  filename: z.string().optional().nullable(),
  status: z.enum(['preparing', 'ready', 'errored']).optional().nullable(),
  playbackId: z.string().optional().nullable(),
  data: dataSchema.optional().nullable(),
});

export type MuxVideoAsset = z.infer<typeof muxVideoAsset>;

const muxVideoSchema = z.object({
  _type: z.literal('mux.video'),
  asset: muxVideoAsset.optional().nullable(),
});

export type MuxVideoType = z.infer<typeof muxVideoSchema>;

// #endregion

export const mediaVideoSchema = z.object({
  image: sanityImageWithAlt.optional().nullable(),
  enableVideo: z.boolean().optional().nullable(),
  videoType: videoTypeEnum.optional().nullable(),
  isAutoPlay: z.boolean().optional().nullable(),
  isPipAutomatic: z.boolean().optional().nullable(),
  videoUrl: z.url().optional().nullable(),
  muxVideo: muxVideoSchema.optional().nullable(),
});

export type MediaVideoType = z.infer<typeof mediaVideoSchema>;
