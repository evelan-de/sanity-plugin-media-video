import { removeUndefinedLocaleResources } from 'sanity';

export const DEFAULT_SCHEMA_TRANSLATIONS = removeUndefinedLocaleResources({
  'image.title': 'Image CUISTOMM',
  'image.description': 'Serves as the image preview of the video',
  'image.required.title': 'Image is required',
  'image.altText.title': 'Alt Text',
  'image.altText.description':
    'Set an alternative text for accessibility purposes',
  'enableVideo.title': 'Enable Video',
  'enableVideo.description': 'Toggle to enable video',
  'videoType.title': 'Video Type',
  'videoType.link.title': 'Link',
  'videoType.required.title': 'Video Type is required',
  'isAutoPlay.title': 'Auto Play',
  'isAutoPlay.description': 'Automatically play the video when loaded',
  'isPipAutomatic.title': 'Enable Automatic PiP for Autoplay',
  'isPipAutomatic.description':
    'This automatically creates a small floating video player when you scroll past the main video',
  'videoUrl.title': 'Video Link',
  'videoUrl.required.title': 'Video Link is required',
  'muxVideo.title': 'Mux Video',
  'muxVideo.required.title': 'Mux Video is required',
});

export const DEFAULT_RESOURCE_BUNDLE = {
  schema: DEFAULT_SCHEMA_TRANSLATIONS,
};

export const DEFAULT_RESOURCE_BUNDLE2 = {
  schema: { ...DEFAULT_SCHEMA_TRANSLATIONS, 'image.title': 'ITS OVERWRITTEN' },
};
