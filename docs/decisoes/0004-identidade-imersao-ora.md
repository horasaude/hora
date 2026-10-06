# 0004 · Identidade visual da Imersão ORA na página de vendas

Data: 2026-10-05

## Contexto

A primeira versão da página usava Fraunces encorpada com itálico terracota, no estilo da referência PAIN. O material oficial da Imersão ORA (Drive "13 - Imersão ORA": capas, carrossel "Uma mulher. Três olhares.") tem outra cara: editorial, de revista.

## Decisão

- Títulos: serifa finíssima em caixa alta (Italiana, a mais parecida no Google Fonts) para a palavra principal, com frase em Montserrat itálico leve antes e depois, como nas capas ("Você é a _ÚLTIMA_ da sua lista"). Em textos.ts: `frase *PALAVRA* complemento`.
- Texto em Montserrat (tem itálico leve; a Outfit não tem).
- Fundo creme (`--color-creme`) alternado com branco; verde ora em títulos e botões. Terracota e ocre saem da página de vendas.
- Etiqueta pequena espaçada no topo de cada bloco ("PAUSA" · "ORA · 2026") e o "A" da logo como marca d'água.
- Fotos do ensaio de 01/10/2026 (Lightroom), em public/fotos (WebP, 30 a 105 KB).
- Primeira dobra no estilo de carolinastaxbusiness.com: vídeo de banco (Pexels, licença livre) cobrindo toda a largura, véu escuro (tinta a 65%) e texto centralizado. Exercício, alimentação e cuidado em sequência, sem som. Tela deitada recebe os vídeos horizontais (960x540), tela em pé os verticais (540x960). Sem vídeo para quem pede menos movimento ou economia de dados.

## Consequências

- Fonte de título é parecida, não idêntica à das capas. Se a designer passar o nome, trocar em index.html e index.css.
- Seis vídeos (1,1 a 2,4 MB cada) em public/videos; cada aparelho baixa só o clipe em exibição do seu conjunto.

## Atualização 2026-10-06

A Italiana não agradou. Os títulos passam a usar Playfair Display (peso 500), escolhida pela dona do projeto entre Playfair, Cormorant Garamond, Bodoni Moda e DM Serif Display. O resto da identidade continua igual.
