import { extractYouTubeVideoId, isYouTubeUrl } from './urlUtils';

export interface ThumbnailProvider {
  name: string;
  canHandle: (url: string) => boolean;
  getThumbnailUrl: (url: string) => Promise<string>;
}

const youtubeProvider: ThumbnailProvider = {
  name: 'youtube',

  canHandle: (url: string): boolean => {
    try {
      return isYouTubeUrl(url);
    } catch {
      return false;
    }
  },

  getThumbnailUrl: async (url: string): Promise<string> => {
    const videoId = extractYouTubeVideoId(url);

    if (!videoId) {
      throw new Error(`Could not extract YouTube video ID from URL: ${url}`);
    }

    const maxResUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    try {
      const response = await fetch(maxResUrl, { method: 'HEAD' });

      if (response.ok) {
        return maxResUrl;
      }
    } catch {
      // Fall through to fallback
    }

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  },
};

const providers: ThumbnailProvider[] = [youtubeProvider];

/**
 * Resolves a thumbnail URL for the given video URL.
 * Iterates through registered providers and returns the thumbnail URL
 * from the first provider that can handle the input.
 * Returns null if no provider supports the URL.
 */
export const resolveThumbnailUrl = async (
  url: string,
): Promise<string | null> => {
  for (const provider of providers) {
    if (provider.canHandle(url)) {
      return provider.getThumbnailUrl(url);
    }
  }

  return null;
};

/**
 * Checks if any registered provider can handle the given URL.
 */
export const canResolveThumbnail = (url: string): boolean => {
  return providers.some((provider) => provider.canHandle(url));
};
