# [FEATURE] Add "Get Thumbnail" Button for YouTube URLs in Media Content

**Date:** 2026-03-30
**Status:** Approved
**Approach:** B — Compose `VideoInputField` with separate `GetThumbnailButton` component + provider utility

---

## Overview

Enhance the `VideoInputField` in the Media Content schema with an inline "Get Thumbnail" button. When clicked, the button extracts a YouTube video's thumbnail, uploads it to Sanity as an image asset, and sets it on the document's `image` field. This streamlines the content editor workflow by eliminating manual thumbnail uploads.

---

## Architecture & File Structure

### New Files

| File | Purpose |
|------|---------|
| `src/utils/thumbnailProviders.ts` | Provider pattern for thumbnail URL extraction (YouTube now, extensible to Vimeo later) |
| `src/components/sanity/GetThumbnailButton.tsx` | Button + loading/error states, orchestrates fetch → upload → patch flow |
| `src/components/sanity/ThumbnailConfirmDialog.tsx` | Radix-based confirmation dialog showing fetched thumbnail preview |
| `src/utils/__tests__/thumbnailProviders.test.ts` | Unit tests for thumbnail provider logic |
| `src/utils/__tests__/urlUtils.test.ts` | Unit tests for URL utility functions |
| `vitest.config.ts` | Vitest configuration |

### Modified Files

| File | Change |
|------|--------|
| `src/components/sanity/VideoInputField.tsx` | Wrap `TextInput` and `GetThumbnailButton` in a `Flex` row |
| `src/utils/urlUtils.ts` | Add `extractYouTubeVideoId()` helper supporting multiple URL formats |
| `src/utils/i18n/resources/en-US.ts` | Add translation keys for button, dialog, toasts |
| `src/utils/i18n/resources/de-DE.ts` | German translations for same keys |
| `package.json` | Add `vitest` dev dependency, add `test` script |

### No New Runtime Dependencies

All UI primitives come from existing dependencies: `@radix-ui/react-dialog`, `@sanity/ui`.

---

## Thumbnail Provider Pattern

### Interface

```ts
interface ThumbnailProvider {
  name: string;
  canHandle: (url: string) => boolean;
  getThumbnailUrl: (url: string) => Promise<string>;
}
```

### YouTube Provider

1. **`canHandle`** — delegates to existing `isYouTubeUrl()` from `urlUtils.ts`
2. **`extractYouTubeVideoId`** — parses video ID from multiple URL formats:
   - `youtube.com/watch?v=VIDEO_ID`
   - `youtu.be/VIDEO_ID`
   - `youtube.com/embed/VIDEO_ID`
   - `youtube-nocookie.com/embed/VIDEO_ID`
3. **`getThumbnailUrl`** — resolution with fallback:
   - Try `HEAD https://img.youtube.com/vi/{videoId}/maxresdefault.jpg`
   - If 200 → return that URL
   - Else → return `https://img.youtube.com/vi/{videoId}/hqdefault.jpg`

### Top-Level Export

```ts
function resolveThumbnailUrl(url: string): Promise<string | null>
```

Iterates through registered providers. Returns thumbnail URL from the first provider that handles the input, or `null` if none match. Adding Vimeo later means registering one more provider object — no changes to consuming code.

---

## UI Flow & Component Behavior

### Layout

```
┌─────────────────────────────────┬──────────────┐
│  TextInput (video URL)          │ Get Thumbnail│
└─────────────────────────────────┴──────────────┘
┌────────────────────────────────────────────────┐
│  ReactPlayer preview (existing)                │
└────────────────────────────────────────────────┘
```

### `GetThumbnailButton` Component

**Inputs:** Receives `videoUrl` (current input value). Uses Sanity hooks internally for client, document ID, form values.

**Button States:**

| State | Appearance |
|-------|------------|
| Disabled | URL is empty or not a supported video URL |
| Idle | Enabled, shows "Get Thumbnail" label |
| Loading | Spinner replaces button text, button disabled |
| Error | Toast notification with error message |
| Success | Toast notification confirming thumbnail was set |

### Click Flow

1. User clicks button → loading state
2. Call `resolveThumbnailUrl(videoUrl)` → get thumbnail image URL
3. Fetch image as blob
4. Check if `image` field already has a value (via `useFormValue(['image'])`)
   - **No existing image** → upload and patch immediately
   - **Existing image** → open `ThumbnailConfirmDialog`

### `ThumbnailConfirmDialog` Component

- Uses `@radix-ui/react-dialog` (already a dependency)
- Shows fetched thumbnail as `<img>` preview
- Warning text: "This will replace the current image. Continue?"
- Two buttons: **Confirm** (uploads and patches) / **Cancel** (closes dialog, discards blob)

---

## Sanity Asset Upload & Document Patching

### Upload

```ts
const asset = await client.assets.upload('image', blob, {
  filename: `youtube-thumbnail-${videoId}.jpg`,
  contentType: 'image/jpeg',
})
```

### Patch

```ts
client.patch(documentId).set({
  'image.asset': { _type: 'reference', _ref: asset._id },
}).commit()
```

### Accessing Sanity Context

- `useClient({apiVersion: '2024-01-01'})` — Sanity client for uploads and patches (API version matches project convention)
- `useFormValue(['_id'])` — document ID for patching
- `useFormValue(['image'])` — check if image field already has a value
- `useToast()` — success/error notifications

---

## i18n Translations

### New Keys

| Key | EN-US | DE-DE |
|-----|-------|-------|
| `getThumbnail.button.title` | Get Thumbnail | Vorschaubild abrufen |
| `getThumbnail.dialog.title` | Set Thumbnail | Vorschaubild setzen |
| `getThumbnail.dialog.description` | This will replace the current image. Continue? | Das aktuelle Bild wird ersetzt. Fortfahren? |
| `getThumbnail.dialog.confirm` | Confirm | Bestätigen |
| `getThumbnail.dialog.cancel` | Cancel | Abbrechen |
| `getThumbnail.success` | Thumbnail set successfully | Vorschaubild erfolgreich gesetzt |
| `getThumbnail.error.fetch` | Failed to fetch thumbnail | Vorschaubild konnte nicht abgerufen werden |
| `getThumbnail.error.upload` | Failed to upload thumbnail | Vorschaubild konnte nicht hochgeladen werden |
| `getThumbnail.error.unsupported` | Unsupported video URL | Nicht unterstützte Video-URL |

All keys follow the existing `mediaVideo` namespace pattern.

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| URL is not a supported provider | Button stays disabled |
| `maxresdefault.jpg` returns 404 | Silent fallback to `hqdefault.jpg` |
| `hqdefault.jpg` also fails | Toast: `getThumbnail.error.fetch` |
| Blob fetch fails (network error) | Toast: `getThumbnail.error.fetch` |
| Sanity asset upload fails | Toast: `getThumbnail.error.upload` |
| Document patch fails | Toast: `getThumbnail.error.upload` |

---

## Testing

### Setup

- Add `vitest` as dev dependency
- Config in `vitest.config.ts`
- Test files: `src/utils/__tests__/*.test.ts`

### Unit Tests — Utility Layer

| Test | What it verifies |
|------|-----------------|
| `extractYouTubeVideoId` — valid formats | Correctly extracts IDs from `watch?v=`, `youtu.be/`, `/embed/`, `/youtube-nocookie.com/embed/` |
| `extractYouTubeVideoId` — invalid | Returns `null` for malformed URLs, non-YouTube URLs, empty strings |
| `isYouTubeUrl` | Locks in existing behavior with explicit test cases |
| `resolveThumbnailUrl` — YouTube | Returns correct thumbnail URL for valid YouTube URL |
| `resolveThumbnailUrl` — unsupported | Returns `null` for Vimeo, random URLs |
| YouTube provider fallback | Falls back from `maxresdefault` to `hqdefault` on 404 |

### Out of Scope

Component rendering tests for `GetThumbnailButton` and `ThumbnailConfirmDialog` — these require mocking Sanity Studio context which is complex and brittle. Utility-layer tests cover the core logic.

---

## Future Extensibility

Adding Vimeo support later requires:
1. Create a `vimeoProvider` object implementing `ThumbnailProvider`
2. Register it in the providers array
3. No changes to `GetThumbnailButton`, `VideoInputField`, or any UI code
