import {
  defineLocaleResourceBundle,
  removeUndefinedLocaleResources,
} from 'sanity';

export const DEFAULT_SCHEMA_TRANSLATIONS = removeUndefinedLocaleResources({
  'image.title': 'Image',
  'image.description': 'Serves as the image preview of the video',
  'image.required.title': 'Image is required',
  'image.altText.title': 'Alt Text',
  'image.altText.description':
    'Set an alternative text for accessibility purposes',
  'enableVideo.title': 'Enable Video',
  'enableVideo.description': 'Toggle to enable video',
  'videoType.title': 'Video Type',
  'videoType.link.title': 'Link',
  'videoType.mux.title': 'Mux',
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

export type ResourcesKeys = keyof typeof DEFAULT_SCHEMA_TRANSLATIONS;

export const DEFAULT_DE_SCHEMA_TRANSLATIONS = removeUndefinedLocaleResources({
  'image.title': 'Bild',
  'image.description': 'Dient als Bildvorschau des Videos',
  'image.required.title': 'Bild ist erforderlich',
  'image.altText.title': 'Alt-Text',
  'image.altText.description':
    'Legen Sie einen alternativen Text für Barrierefreiheit fest',
  'enableVideo.title': 'Video aktivieren',
  'enableVideo.description': 'Schalter zum Aktivieren des Videos',
  'videoType.title': 'Videotyp',
  'videoType.link.title': 'Link',
  'videoType.mux.title': 'Mux',
  'videoType.required.title': 'Videotyp ist erforderlich',
  'isAutoPlay.title': 'Automatische Wiedergabe',
  'isAutoPlay.description':
    'Das Video wird automatisch abgespielt, wenn es geladen wird',
  'isPipAutomatic.title': 'Automatisches PiP für Autoplay aktivieren',
  'isPipAutomatic.description':
    'Dies erstellt automatisch einen kleinen schwebenden Videoplayer, wenn Sie am Hauptvideo vorbeiscrollen',
  'videoUrl.title': 'Videolink',
  'videoUrl.required.title': 'Videolink ist erforderlich',
  'muxVideo.title': 'Mux-Video',
  'muxVideo.required.title': 'Mux-Video ist erforderlich',
});

export const DEFAULT_RESOURCE_BUNDLE_EN = defineLocaleResourceBundle({
  locale: 'en-EN',
  namespace: 'schema',
  resources: DEFAULT_SCHEMA_TRANSLATIONS,
});

export const DEFAULT_RESOURCE_BUNDLE_DE = defineLocaleResourceBundle({
  locale: 'de-DE',
  namespace: 'schema',
  resources: DEFAULT_DE_SCHEMA_TRANSLATIONS,
});
