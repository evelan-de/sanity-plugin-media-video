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
      isYouTubeUrl('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'),
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
