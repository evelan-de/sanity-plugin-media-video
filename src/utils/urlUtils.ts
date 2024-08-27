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
