import { removeUndefinedLocaleResources } from 'sanity';

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
  'muxVideo.required.title': 'Mux-Video ist erforderlich',
});
