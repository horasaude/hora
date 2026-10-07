import { describe, expect, it } from 'vitest'
import { linkDeIncorporacao } from './video'

const YT = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'

describe('linkDeIncorporacao', () => {
  it.each([
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', YT],
    ['https://youtube.com/watch?v=dQw4w9WgXcQ&t=30s', YT],
    ['https://m.youtube.com/watch?v=dQw4w9WgXcQ', YT],
    ['https://youtu.be/dQw4w9WgXcQ?si=abc', YT],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ', YT],
    ['https://www.youtube.com/live/dQw4w9WgXcQ', YT],
    ['  https://youtu.be/dQw4w9WgXcQ  ', YT],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ', YT],
    ['https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', YT],
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL123&index=2', YT],
    ['https://youtu.be/dQw4w9WgXcQ?t=42', YT],
    ['https://vimeo.com/123456789', 'https://player.vimeo.com/video/123456789'],
    ['https://vimeo.com/channels/staff/123456789', 'https://player.vimeo.com/video/123456789'],
    ['https://player.vimeo.com/video/123456789?h=x', 'https://player.vimeo.com/video/123456789'],
    [
      'https://drive.google.com/file/d/1AbCdEfGhIjK/view?usp=sharing',
      'https://drive.google.com/file/d/1AbCdEfGhIjK/preview',
    ],
  ])('%s', (entrada, saida) => {
    expect(linkDeIncorporacao(entrada)).toBe(saida)
  })

  it.each([
    '',
    'não é link',
    'http://youtu.be/dQw4w9WgXcQ',
    'https://exemplo.com/video.mp4',
    'https://www.youtube.com/watch',
    'https://www.youtube.com/@canaldaora',
    'https://drive.google.com/drive/folders/1AbCdEfGhIjK',
  ])('sem prévia para "%s"', (entrada) => {
    expect(linkDeIncorporacao(entrada)).toBeNull()
  })
})
