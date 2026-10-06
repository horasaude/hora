# components

- ui/: peças visuais com a identidade do ORA (Botao, Campo). Sem lógica de negócio, sem Supabase.
- shared/: componentes usados por duas ou mais features que têm alguma lógica de tela.
  Componente usado por uma feature só fica dentro da própria feature.

| shared/VideoFundo.tsx | Vídeos de fundo (corrida, academia, salada, refeição; cortes de 6 s) para tela em pé e deitada; usado no topo da página de vendas e no checkout |
