# domain

Regras de negócio puras: sem React, sem Supabase, sempre com teste ao lado (arquivo.test.ts).
Exemplos que vão morar aqui: cálculo de pontos e limites, liberação de etapa, validade da oferta do ORA, preços.
Quando a mesma regra existir em SQL (RLS ou função do banco), deve haver teste garantindo que as duas respondem igual.

| Arquivo   | Regra                                                                                |
| --------- | ------------------------------------------------------------------------------------ |
| oferta.ts | Oferta do ORA válida até 24/10/2026 23h59 de Brasília                                |
| precos.ts | Preços em centavos: oferta do ORA até o fim da oferta, cheios depois; tempo restante |
