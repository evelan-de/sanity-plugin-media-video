import { z } from 'zod';

/**
 * Asset structure from Sanity. Used for Sanity Image.
 *
 * @note update type as you use more properties
 */
const sanityImage = z.object({
  asset: z.object({
    _id: z.string(),
    metadata: z
      .object({
        lqip: z.string(),
      })
      .optional(),
    url: z.string().url(),
  }),
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

export const sanityImageWithAlt = z
  .object({
    altText: z.string().optional(),
  })
  .merge(sanityImage);

export type SanityImageType = z.infer<typeof sanityImageWithAlt>;

const videoTypeEnum = z.enum(['link', 'mux']);

export type VideoType = z.infer<typeof videoTypeEnum>;

// #region Mux Video schema
// Schema for playback ID
const playbackIdSchema = z.object({
  id: z.string().optional(),
  policy: z.enum(['public', 'signed']).optional(),
});

// Schema for tracks
const trackSchema = z.object({
  max_channel_layout: z.string().optional(),
  max_channels: z.number().optional(),
  id: z.string().optional(),
  type: z.enum(['audio', 'video']).optional(),
  primary: z.boolean().optional(),
  duration: z.number().optional(),
  max_frame_rate: z.number().optional(),
  max_height: z.number().optional(),
  max_width: z.number().optional(),
});

// Schema for the 'data' field
const dataSchema = z.object({
  encoding_tier: z.string().optional(),
  max_resolution_tier: z.string().optional(),
  aspect_ratio: z.string().optional(),
  created_at: z.string().optional(),
  duration: z.number().optional(),
  status: z.enum(['preparing', 'ready', 'errored']).optional(),
  master_access: z.string().optional(),
  max_stored_frame_rate: z.number().optional(),
  playback_ids: z.array(playbackIdSchema).optional(),
  resolution_tier: z.string().optional(),
  ingest_type: z.string().optional(),
  max_stored_resolution: z.string().optional(),
  tracks: z.array(trackSchema).optional(),
  id: z.string().optional(),
  mp4_support: z.string().optional(),
});

// Schema for the main structure
const muxVideoAsset = z.object({
  _id: z.string().optional(),
  _type: z.literal('mux.videoAsset').optional(),
  assetId: z.string().optional(),
  filename: z.string().optional(),
  status: z.enum(['preparing', 'ready', 'errored']).optional(),
  playbackId: z.string().optional(),
  data: dataSchema.optional(),
});

export type MuxVideoAsset = z.infer<typeof muxVideoAsset>;

const muxVideoSchema = z.object({
  _type: z.literal('mux.video'),
  asset: muxVideoAsset.optional(),
});

export type MuxVideoType = z.infer<typeof muxVideoSchema>;

// #endregion
