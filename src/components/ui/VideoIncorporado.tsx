/**
 * Vídeo da plataforma dentro da página. No Drive, uma tampa invisível cobre o botão de abrir em
 * outra janela (de lá dava para baixar); a gravação também sai do Drive sem a opção de baixar.
 */
export function VideoIncorporado({ src, titulo }: { src: string; titulo: string }) {
  const drive = src.startsWith('https://drive.google.com/')
  return (
    <div className="relative h-full w-full">
      <iframe
        src={src}
        title={titulo}
        className="h-full w-full"
        allow="encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
      {drive && <div aria-hidden className="absolute top-0 right-0 h-16 w-16" />}
    </div>
  )
}
