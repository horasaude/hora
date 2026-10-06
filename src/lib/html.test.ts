import { describe, expect, it } from 'vitest'
import { sanitizarHtml } from './html'

describe('sanitizarHtml', () => {
  it('mantém negrito e listas e tira atributos', () => {
    expect(
      sanitizarHtml('<b style="color:red">2 ovos</b><ul><li onclick="x()">sal</li></ul>'),
    ).toBe('<b>2 ovos</b><ul><li>sal</li></ul>')
  })
  it('remove script, imagem e link, mantendo o texto do link', () => {
    expect(
      sanitizarHtml(
        '<script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:x">ver</a>',
      ),
    ).toBe('ver')
  })
})
