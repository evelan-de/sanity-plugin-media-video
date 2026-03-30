export const isYouTubeUrl = (url: string) => {
  const { hostname } = new URL(url);

  return hostname.includes('youtube.com') || hostname.includes('youtu.be');
};

// Convert video link (Youtube case) to use "/embed" instead of "/watch", reason being as there were some complications found in stackoverflow that said using "watch" resulted to an error on their side. (https://stackoverflow.com/a/25661346/6579623)
export const convertYoutubeToEmbedUrl = (url: string): string => {
  if (isYouTubeUrl(url)) {
    const searchParams = new URLSearchParams(new URL(url).search);
    const videoId = searchParams.get('v');

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  return url; // Return the original URL if it's not a YouTube URL or the video ID is not found
};

/**
 * Extracts YouTube video ID from various URL formats.
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube-nocookie.com/embed/
 * Returns null if the URL is not a valid YouTube URL or the video ID cannot be extracted.
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    const { hostname, pathname, searchParams } = parsed;

    // youtube.com/watch?v=VIDEO_ID
    if (
      (hostname.includes('youtube.com') ||
        hostname.includes('youtube-nocookie.com')) &&
      pathname === '/watch'
    ) {
      return searchParams.get('v');
    }

    // youtube.com/embed/VIDEO_ID or youtube-nocookie.com/embed/VIDEO_ID
    if (
      (hostname.includes('youtube.com') ||
        hostname.includes('youtube-nocookie.com')) &&
      pathname.startsWith('/embed/')
    ) {
      const id = pathname.split('/embed/')[1]?.split(/[/?]/)[0];
      return id || null;
    }

    // youtu.be/VIDEO_ID
    if (hostname === 'youtu.be') {
      const id = pathname.slice(1).split(/[/?]/)[0];
      return id || null;
    }

    return null;
  } catch {
    return null;
  }
};
