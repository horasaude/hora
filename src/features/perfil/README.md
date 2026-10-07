# feature: perfil

Perfil da aluna (/app/perfil). No computador, duas colunas; no celular, Evolução, Indicar, Configurações e Histórico, nessa ordem.

| Arquivo                      | Faz                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------ |
| pages/PerfilPage.tsx         | Monta a tela                                                                               |
| components/Topo.tsx          | Foto ou inicial, nome, apelido e "Dia 12 · Semana 2"; exporta Avatar                       |
| components/Resumo.tsx        | Pontos no mês, dias seguidos, aulas concluídas, desafios completos                         |
| components/Evolucao.tsx      | Minha evolução: abas por medida, GraficoLinha, ListaMedidas, Registrar medidas             |
| components/JanelaMedida.tsx  | Data, peso, cintura, quadril, braço, coxa (vírgula enquanto digita) e foto opcional        |
| components/Indicar.tsx       | Link pessoal, Copiar link, Enviar no WhatsApp e lista das indicações com situação e pontos |
| components/Configuracoes.tsx | Aparecer no ranking (chave), Editar apelido e foto, Trocar senha, painel (admin) e Sair    |
| components/Historico.tsx     | Histórico de pontos de 10 em 10 (25, 50, 100)                                              |
| api/*.ts                     | perfil (apelido, foto, ranking, senha), medidas, indicações e histórico                    |
| schemas/                     | medida (ao menos uma, limites do banco), apelido e senha                                   |

Medidas e foto de perfil ficam no espaço privado evolucao, na pasta da aluna; só ela e as profissionais veem. Peso e medidas nunca entram em ranking.
Exporta (index.ts): PerfilPage.
