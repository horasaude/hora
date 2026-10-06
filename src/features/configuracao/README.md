# feature: configuracao

Leitura pública da tabela configuracoes (preços dos planos, janela da oferta do ORA, termos e privacidade), editada no painel em /app/admin/configuracoes. Usa fetch simples com a chave pública, sem o cliente do Supabase, para não pesar a página de vendas. Uma busca por visita; até chegar (ou se falhar) valem CONFIGURACAO_PADRAO (src/domain/configuracao.ts) e os textos de src/features/vendas/textos/legal.ts.

Exporta (index.ts): useConfiguracao (preços e janela), useConfiguracaoPublica (tudo, ou null).
