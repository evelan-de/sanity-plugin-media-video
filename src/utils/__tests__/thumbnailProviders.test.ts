import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  canResolveThumbnail,
  resolveThumbnailUrl,
} from '../thumbnailProviders';

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
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));

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

    expect(result).toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
  });

  it('falls back to hqdefault when HEAD request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error')),
    );

    const result = await resolveThumbnailUrl(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    );

    expect(result).toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
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
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));

    const result = await resolveThumbnailUrl('https://youtu.be/dQw4w9WgXcQ');

    expect(result).toBe(
      'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    );
  });

  it('works with embed URLs', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));

    const result = await resolveThumbnailUrl(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    );

    expect(result).toBe(
      'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    );
  });
});
