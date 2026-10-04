# 0003 · PWA só na área da aluna

Data: 2026-10-04

## Contexto

O service worker era registrado com escopo "/" e guardava o index.html. Quem já tinha visitado recebia a versão anterior na primeira abertura depois de um deploy. Na página de vendas isso mostra texto ou condição antiga, e o registro ainda baixava o app inteiro em segundo plano no celular de quem vem do anúncio.

## Decisão

No vite-plugin-pwa (2.0.0): `scope: '/app/'` e `injectRegister: false`, com o manifest em `start_url: '/app'` e `scope: '/app/'`. O registro passa a ser feito por `registerSW` (virtual:pwa-register) só quando a área da aluna abre (src/lib/pwa.ts). Opções conferidas nos tipos do plugin instalado (node_modules/vite-plugin-pwa/dist/index.d.ts).

Registros antigos com escopo "/" são removidos ao abrir qualquer página (src/lib/pwaAntigo.ts).

## Consequências

- A página de vendas vem sempre da rede, na versão do último deploy, e não baixa o app em segundo plano.
- O app instalável abre em /app. Login (/entrar) fica fora do escopo e não funciona sem internet, o que já era esperado.
