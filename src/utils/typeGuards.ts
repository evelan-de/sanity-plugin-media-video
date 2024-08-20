import { type SanityImageType, sanityImageWithAlt } from '../types/schema';

// Type guards the sanity image object
export const isSanityImage = (value: unknown): value is SanityImageType => {
  return sanityImageWithAlt.safeParse(value).success;
};
