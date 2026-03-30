# Get Thumbnail Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an inline "Get Thumbnail" button next to the video URL input that extracts YouTube thumbnails, uploads them to Sanity, and sets the document's image field.

**Architecture:** A `thumbnailProviders` utility module handles URL-to-thumbnail resolution with a provider pattern (YouTube first, extensible). A `GetThumbnailButton` component orchestrates the UI flow (button states, confirmation dialog, asset upload). The existing `VideoInputField` composes the button inline next to its `TextInput`.

**Tech Stack:** React 19, Sanity v5 (`useClient`, `useFormValue`, `useToast`), `@radix-ui/react-dialog`, `@sanity/ui`, Vitest (new dev dependency)

**Spec:** `docs/superpowers/specs/2026-03-30-get-thumbnail-button-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/utils/urlUtils.ts` | Modify | Add `extractYouTubeVideoId()` |
| `src/utils/thumbnailProviders.ts` | Create | Provider pattern + `resolveThumbnailUrl()` |
| `src/components/sanity/ThumbnailConfirmDialog.tsx` | Create | Radix dialog with thumbnail preview + confirm/cancel |
| `src/components/sanity/GetThumbnailButton.tsx` | Create | Button + orchestration (fetch, upload, patch, dialog) |
| `src/components/sanity/VideoInputField.tsx` | Modify | Compose button inline next to TextInput |
| `src/utils/i18n/en-US.ts` | Modify | Add EN translation keys |
| `src/utils/i18n/de-DE.ts` | Modify | Add DE translation keys |
| `vitest.config.ts` | Create | Vitest configuration |
| `package.json` | Modify | Add vitest dev dep + test script |
| `src/utils/__tests__/urlUtils.test.ts` | Create | Tests for `extractYouTubeVideoId` and `isYouTubeUrl` |
| `src/utils/__tests__/thumbnailProviders.test.ts` | Create | Tests for `resolveThumbnailUrl` and YouTube provider |

---

## Task 1: Add `extractYouTubeVideoId` to URL utilities

**Files:**
- Modify: `src/utils/urlUtils.ts`

- [ ] **Step 1: Add `extractYouTubeVideoId` function**

Add to the bottom of `src/utils/urlUtils.ts`:

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/urlUtils.ts
git commit -m "feat: add extractYouTubeVideoId utility function"
```

---

## Task 2: Set up Vitest and write URL utility tests

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`
- Create: `src/utils/__tests__/urlUtils.test.ts`

- [ ] **Step 1: Install vitest**

```bash
npm install -D vitest
```

- [ ] **Step 2: Create vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

- [ ] **Step 3: Add test script to package.json**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Write tests for `isYouTubeUrl`**

Create `src/utils/__tests__/urlUtils.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { extractYouTubeVideoId, isYouTubeUrl } from '../urlUtils';

describe('isYouTubeUrl', () => {
  it('returns true for youtube.com URLs', () => {
    expect(isYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      true,
    );
  });

  it('returns true for youtu.be URLs', () => {
    expect(isYouTubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
  });

  it('returns true for youtube-nocookie.com URLs', () => {
    expect(
      isYouTubeUrl(
        'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      ),
    ).toBe(false); // Note: current implementation only checks youtube.com and youtu.be
  });

  it('returns false for non-YouTube URLs', () => {
    expect(isYouTubeUrl('https://vimeo.com/123456')).toBe(false);
  });

  it('returns false for random URLs', () => {
    expect(isYouTubeUrl('https://example.com')).toBe(false);
  });
});

describe('extractYouTubeVideoId', () => {
  it('extracts ID from youtube.com/watch?v= URL', () => {
    expect(
      extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
    ).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from youtu.be/ URL', () => {
    expect(extractYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('extracts ID from youtube.com/embed/ URL', () => {
    expect(
      extractYouTubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ'),
    ).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from youtube-nocookie.com/embed/ URL', () => {
    expect(
      extractYouTubeVideoId(
        'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      ),
    ).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from URL with extra query params', () => {
    expect(
      extractYouTubeVideoId(
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120',
      ),
    ).toBe('dQw4w9WgXcQ');
  });

  it('returns null for non-YouTube URL', () => {
    expect(extractYouTubeVideoId('https://vimeo.com/123456')).toBeNull();
  });

  it('returns null for invalid URL', () => {
    expect(extractYouTubeVideoId('not-a-url')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractYouTubeVideoId('')).toBeNull();
  });

  it('returns null for YouTube URL without video ID', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/')).toBeNull();
  });
});
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts package.json package-lock.json src/utils/__tests__/urlUtils.test.ts
git commit -m "test: add vitest setup and URL utility tests"
```

---

## Task 3: Create thumbnail providers utility

**Files:**
- Create: `src/utils/thumbnailProviders.ts`

- [ ] **Step 1: Create the thumbnail providers module**

Create `src/utils/thumbnailProviders.ts`:

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/thumbnailProviders.ts
git commit -m "feat: add thumbnail provider pattern with YouTube support"
```

---

## Task 4: Write thumbnail provider tests

**Files:**
- Create: `src/utils/__tests__/thumbnailProviders.test.ts`

- [ ] **Step 1: Write tests**

Create `src/utils/__tests__/thumbnailProviders.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';

import { canResolveThumbnail, resolveThumbnailUrl } from '../thumbnailProviders';

describe('canResolveThumbnail', () => {
  it('returns true for YouTube URLs', () => {
    expect(
      canResolveThumbnail('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
    ).toBe(true);
  });

  it('returns true for youtu.be URLs', () => {
    expect(canResolveThumbnail('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
  });

  it('returns false for Vimeo URLs', () => {
    expect(canResolveThumbnail('https://vimeo.com/123456')).toBe(false);
  });

  it('returns false for random URLs', () => {
    expect(canResolveThumbnail('https://example.com')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(canResolveThumbnail('')).toBe(false);
  });

  it('returns false for invalid URL', () => {
    expect(canResolveThumbnail('not-a-url')).toBe(false);
  });
});

describe('resolveThumbnailUrl', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns maxresdefault URL when available', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true }),
    );

    const result = await resolveThumbnailUrl(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    );

    expect(result).toBe(
      'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    );
  });

  it('falls back to hqdefault when maxresdefault returns 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );

    const result = await resolveThumbnailUrl(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    );

    expect(result).toBe(
      'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    );
  });

  it('falls back to hqdefault when HEAD request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error')),
    );

    const result = await resolveThumbnailUrl(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    );

    expect(result).toBe(
      'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    );
  });

  it('returns null for unsupported URLs', async () => {
    const result = await resolveThumbnailUrl('https://vimeo.com/123456');

    expect(result).toBeNull();
  });

  it('returns null for empty string', async () => {
    const result = await resolveThumbnailUrl('');

    expect(result).toBeNull();
  });

  it('works with youtu.be URLs', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true }),
    );

    const result = await resolveThumbnailUrl('https://youtu.be/dQw4w9WgXcQ');

    expect(result).toBe(
      'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    );
  });

  it('works with embed URLs', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true }),
    );

    const result = await resolveThumbnailUrl(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    );

    expect(result).toBe(
      'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/utils/__tests__/thumbnailProviders.test.ts
git commit -m "test: add thumbnail provider tests"
```

---

## Task 5: Add i18n translations

**Files:**
- Modify: `src/utils/i18n/en-US.ts`
- Modify: `src/utils/i18n/de-DE.ts`

- [ ] **Step 1: Add English translations**

In `src/utils/i18n/en-US.ts`, add the following keys before the closing `})`:

```ts
  'getThumbnail.button.title': 'Get Thumbnail',
  'getThumbnail.dialog.title': 'Set Thumbnail',
  'getThumbnail.dialog.description':
    'This will replace the current image. Continue?',
  'getThumbnail.dialog.confirm': 'Confirm',
  'getThumbnail.dialog.cancel': 'Cancel',
  'getThumbnail.success': 'Thumbnail set successfully',
  'getThumbnail.error.fetch': 'Failed to fetch thumbnail',
  'getThumbnail.error.upload': 'Failed to upload thumbnail',
  'getThumbnail.error.unsupported': 'Unsupported video URL',
```

- [ ] **Step 2: Add German translations**

In `src/utils/i18n/de-DE.ts`, add the following keys before the closing `})`:

```ts
  'getThumbnail.button.title': 'Vorschaubild abrufen',
  'getThumbnail.dialog.title': 'Vorschaubild setzen',
  'getThumbnail.dialog.description':
    'Das aktuelle Bild wird ersetzt. Fortfahren?',
  'getThumbnail.dialog.confirm': 'Bestätigen',
  'getThumbnail.dialog.cancel': 'Abbrechen',
  'getThumbnail.success': 'Vorschaubild erfolgreich gesetzt',
  'getThumbnail.error.fetch': 'Vorschaubild konnte nicht abgerufen werden',
  'getThumbnail.error.upload':
    'Vorschaubild konnte nicht hochgeladen werden',
  'getThumbnail.error.unsupported': 'Nicht unterstützte Video-URL',
```

- [ ] **Step 3: Commit**

```bash
git add src/utils/i18n/en-US.ts src/utils/i18n/de-DE.ts
git commit -m "feat: add i18n translations for get thumbnail feature"
```

---

## Task 6: Create `ThumbnailConfirmDialog` component

**Files:**
- Create: `src/components/sanity/ThumbnailConfirmDialog.tsx`

- [ ] **Step 1: Create the dialog component**

Create `src/components/sanity/ThumbnailConfirmDialog.tsx`:

```tsx
import * as Dialog from '@radix-ui/react-dialog';
import { Box, Button, Card, Flex, Text } from '@sanity/ui';
import React, { FC } from 'react';

interface ThumbnailConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  thumbnailUrl: string;
  confirmLabel: string;
  cancelLabel: string;
  title: string;
  description: string;
}

const ThumbnailConfirmDialog: FC<ThumbnailConfirmDialogProps> = ({
  open,
  onConfirm,
  onCancel,
  thumbnailUrl,
  confirmLabel,
  cancelLabel,
  title,
  description,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1001,
            maxWidth: '500px',
            width: '90vw',
          }}
        >
          <Card padding={4} radius={2} shadow={2}>
            <Flex direction='column' gap={4}>
              <Dialog.Title asChild>
                <Text size={2} weight='bold'>
                  {title}
                </Text>
              </Dialog.Title>

              <Box>
                <img
                  src={thumbnailUrl}
                  alt='YouTube thumbnail preview'
                  style={{
                    width: '100%',
                    borderRadius: '4px',
                    display: 'block',
                  }}
                />
              </Box>

              <Dialog.Description asChild>
                <Text size={1} muted>
                  {description}
                </Text>
              </Dialog.Description>

              <Flex gap={2} justify='flex-end'>
                <Button
                  mode='ghost'
                  text={cancelLabel}
                  onClick={onCancel}
                />
                <Button
                  tone='primary'
                  text={confirmLabel}
                  onClick={onConfirm}
                />
              </Flex>
            </Flex>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ThumbnailConfirmDialog;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sanity/ThumbnailConfirmDialog.tsx
git commit -m "feat: add ThumbnailConfirmDialog component"
```

---

## Task 7: Create `GetThumbnailButton` component

**Files:**
- Create: `src/components/sanity/GetThumbnailButton.tsx`

- [ ] **Step 1: Create the button component**

The component uses the `path` prop (from Sanity's `StringInputProps`) to dynamically determine
where the sibling `image` field lives. This works regardless of where the `media` object is used
in the document — root level, inside arrays, deeply nested, etc.

| Scenario | `path` prop | Derived image patch path |
|---|---|---|
| Root-level | `['media', 'videoUrl']` | `media.image.asset` |
| In array | `['body', {_key: 'xxx'}, 'media', 'videoUrl']` | `body[_key=="xxx"].media.image.asset` |
| Non-array nesting | `['hero', 'media', 'videoUrl']` | `hero.media.image.asset` |
| Deep nesting | `['sections', {_key: 'a'}, 'content', 'media', 'videoUrl']` | `sections[_key=="a"].content.media.image.asset` |

Create `src/components/sanity/GetThumbnailButton.tsx`:

```tsx
import { Button, Spinner } from '@sanity/ui';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Path, useClient, useFormValue, useToast } from 'sanity';

import { I18N_NAMESPACE } from '../../utils/constants';
import {
  canResolveThumbnail,
  resolveThumbnailUrl,
} from '../../utils/thumbnailProviders';
import ThumbnailConfirmDialog from './ThumbnailConfirmDialog';

/**
 * Converts a Sanity path array to a dot-notation string for client.patch().set().
 *
 * Examples:
 *   ['media', 'image']                                     → 'media.image'
 *   ['body', {_key: 'abc'}, 'media', 'image']              → 'body[_key=="abc"].media.image'
 *   ['hero', 'media', 'image']                              → 'hero.media.image'
 *   ['sections', {_key: 'a'}, 'content', 'media', 'image'] → 'sections[_key=="a"].content.media.image'
 */
const pathToString = (path: Path): string => {
  return path
    .map((segment) => {
      if (typeof segment === 'string') {
        return segment;
      }
      if (typeof segment === 'object' && '_key' in segment) {
        return `[_key=="${segment._key}"]`;
      }
      return `[${String(segment)}]`;
    })
    .reduce((acc, segment) => {
      if (segment.startsWith('[')) {
        return acc + segment;
      }
      return acc ? `${acc}.${segment}` : segment;
    }, '');
};

interface GetThumbnailButtonProps {
  videoUrl: string | undefined;
  path: Path;
  t: (key: string) => string;
}

const GetThumbnailButton: FC<GetThumbnailButtonProps> = ({ videoUrl, path, t }) => {
  const client = useClient({ apiVersion: '2024-01-01' });
  const documentId = useFormValue(['_id']) as string | undefined;
  const toast = useToast();

  // Derive sibling image path from current field's path
  // path = [..., 'videoUrl'] → parentPath = [...] → imagePath = [..., 'image']
  const parentPath = useMemo(() => path.slice(0, -1), [path]);
  const imagePath = useMemo(() => [...parentPath, 'image'], [parentPath]);

  const imageValue = useFormValue(imagePath) as { asset?: unknown } | undefined;

  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fetchedThumbnailUrl, setFetchedThumbnailUrl] = useState<string | null>(
    null,
  );

  const isDisabled =
    !videoUrl || !canResolveThumbnail(videoUrl) || isLoading;

  const uploadAndPatch = useCallback(
    async (thumbnailUrl: string) => {
      if (!documentId) {
        return;
      }

      try {
        const response = await fetch(thumbnailUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const blob = await response.blob();

        const asset = await client.assets.upload('image', blob, {
          filename: `youtube-thumbnail.jpg`,
          contentType: 'image/jpeg',
        });

        const patchId = documentId.startsWith('drafts.')
          ? documentId
          : `drafts.${documentId}`;

        const imagePathStr = pathToString(imagePath);

        await client
          .patch(patchId)
          .set({
            [`${imagePathStr}.asset`]: {
              _type: 'reference',
              _ref: asset._id,
            },
          })
          .commit();

        toast.push({
          status: 'success',
          title: t(`${I18N_NAMESPACE}:getThumbnail.success`),
        });
      } catch (error) {
        console.error('Thumbnail upload failed:', error);
        toast.push({
          status: 'error',
          title: t(`${I18N_NAMESPACE}:getThumbnail.error.upload`),
        });
      }
    },
    [client, documentId, imagePath, toast, t],
  );

  const handleClick = useCallback(async () => {
    if (!videoUrl) {
      return;
    }

    setIsLoading(true);

    try {
      const thumbnailUrl = await resolveThumbnailUrl(videoUrl);

      if (!thumbnailUrl) {
        toast.push({
          status: 'error',
          title: t(`${I18N_NAMESPACE}:getThumbnail.error.unsupported`),
        });
        return;
      }

      const hasExistingImage = !!imageValue?.asset;

      if (hasExistingImage) {
        setFetchedThumbnailUrl(thumbnailUrl);
        setDialogOpen(true);
      } else {
        await uploadAndPatch(thumbnailUrl);
      }
    } catch (error) {
      console.error('Thumbnail fetch failed:', error);
      toast.push({
        status: 'error',
        title: t(`${I18N_NAMESPACE}:getThumbnail.error.fetch`),
      });
    } finally {
      setIsLoading(false);
    }
  }, [videoUrl, imageValue, uploadAndPatch, toast, t]);

  const handleDialogConfirm = useCallback(async () => {
    setDialogOpen(false);

    if (fetchedThumbnailUrl) {
      setIsLoading(true);

      try {
        await uploadAndPatch(fetchedThumbnailUrl);
      } finally {
        setIsLoading(false);
        setFetchedThumbnailUrl(null);
      }
    }
  }, [fetchedThumbnailUrl, uploadAndPatch]);

  const handleDialogCancel = useCallback(() => {
    setDialogOpen(false);
    setFetchedThumbnailUrl(null);
  }, []);

  return (
    <>
      <Button
        text={isLoading ? undefined : t(`${I18N_NAMESPACE}:getThumbnail.button.title`)}
        icon={isLoading ? Spinner : undefined}
        mode='ghost'
        tone='primary'
        disabled={isDisabled}
        onClick={handleClick}
        style={{ whiteSpace: 'nowrap' }}
      />
      {fetchedThumbnailUrl && (
        <ThumbnailConfirmDialog
          open={dialogOpen}
          onConfirm={handleDialogConfirm}
          onCancel={handleDialogCancel}
          thumbnailUrl={fetchedThumbnailUrl}
          title={t(`${I18N_NAMESPACE}:getThumbnail.dialog.title`)}
          description={t(`${I18N_NAMESPACE}:getThumbnail.dialog.description`)}
          confirmLabel={t(`${I18N_NAMESPACE}:getThumbnail.dialog.confirm`)}
          cancelLabel={t(`${I18N_NAMESPACE}:getThumbnail.dialog.cancel`)}
        />
      )}
    </>
  );
};

export default GetThumbnailButton;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sanity/GetThumbnailButton.tsx
git commit -m "feat: add GetThumbnailButton component"
```

---

## Task 8: Integrate button into `VideoInputField`

**Files:**
- Modify: `src/components/sanity/VideoInputField.tsx`

- [ ] **Step 1: Update VideoInputField to compose the button**

Replace the entire contents of `src/components/sanity/VideoInputField.tsx` with:

```tsx
import { Flex, Stack, TextInput } from '@sanity/ui';
import React, { FC } from 'react';
import ReactPlayer from 'react-player';
import { StringInputProps, useTranslation } from 'sanity';

import { I18N_NAMESPACE } from '../../utils/constants';
import GetThumbnailButton from './GetThumbnailButton';

// Normalize default export across ESM/CJS to avoid undefined component in Next 16
// https://github.com/cookpete/react-player/issues/1690
const unwrapDefault = (value: unknown) =>
  (value as { default?: unknown } | null | undefined)?.default ?? value;
const Player = unwrapDefault(unwrapDefault(ReactPlayer)) as typeof ReactPlayer;

/*
This component adds a custom component that displays a Video Preview of the media schema when
type is 'link'
*/
const VideoInputField: FC<StringInputProps> = (props: StringInputProps) => {
  const { elementProps, path } = props;
  const { value } = elementProps;
  const { t } = useTranslation(I18N_NAMESPACE);

  return (
    <Stack space={2}>
      <Flex gap={2} align='center'>
        <div style={{ flex: 1 }}>
          <TextInput {...elementProps} />
        </div>
        <GetThumbnailButton videoUrl={value} path={path} t={t} />
      </Flex>

      {value && (
        /* Player ratio: 100 / (1280 / 720) */
        <div
          style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}
        >
          <Player
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: '100%',
            }}
            width='100%'
            height='100%'
            controls
            pip={false}
            playsInline
            url={value}
            config={{
              // https://developers.google.com/youtube/player_parameters
              youtube: {
                // eslint-disable-next-line camelcase
                playerVars: { playsinline: 0, iv_load_policy: 3 },
                embedOptions: {
                  host: 'https://www.youtube-nocookie.com',
                },
              },
              file: {
                attributes: {
                  preload: 'metadata',
                },
                hlsOptions: {
                  startLevel: 6,
                },
              },
            }}
          />
        </div>
      )}
    </Stack>
  );
};

export default VideoInputField;
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds without errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sanity/VideoInputField.tsx
git commit -m "feat: integrate GetThumbnailButton into VideoInputField"
```

---

## Task 9: Run full test suite and verify

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No lint errors. If there are any, fix them.

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Final commit (if any lint fixes were needed)**

```bash
git add -A
git commit -m "chore: fix lint issues"
```
