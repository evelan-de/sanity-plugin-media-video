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
  'getThumbnail.button.title': 'Vorschaubild abrufen',
  'getThumbnail.button.tooltip':
    'Ruft das Vorschaubild des Videos von der URL ab und setzt es als Bild',
  'getThumbnail.dialog.title': 'Vorschaubild setzen',
  'getThumbnail.dialog.description':
    'Das aktuelle Bild wird ersetzt. Fortfahren?',
  'getThumbnail.dialog.confirm': 'Bestätigen',
  'getThumbnail.dialog.cancel': 'Abbrechen',
  'getThumbnail.success': 'Vorschaubild erfolgreich gesetzt',
  'getThumbnail.error.fetch': 'Vorschaubild konnte nicht abgerufen werden',
  'getThumbnail.error.upload': 'Vorschaubild konnte nicht hochgeladen werden',
  'getThumbnail.error.unsupported': 'Nicht unterstützte Video-URL',
});
