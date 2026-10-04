type Props = { texto: string; cor?: 'terracota' | 'ocre' }

/** Lê "Chegou a sua *HORA*" e põe a palavra entre asteriscos em serifa itálica colorida. */
export function Destaque({ texto, cor = 'terracota' }: Props) {
  const partes = texto.split(/\*(.+?)\*/)
  const classe = `font-titulo font-normal italic ${cor === 'ocre' ? 'text-ocre' : 'text-terracota'}`
  return (
    <>
      {partes.map((parte, i) =>
        i % 2 ? (
          <em key={i} className={classe}>
            {parte}
          </em>
        ) : (
          parte
        ),
      )}
    </>
  )
}
