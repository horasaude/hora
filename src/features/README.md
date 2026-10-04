# features

Uma pasta por funcionalidade, sempre com a mesma forma:

```
<nome>/
  index.ts       o que outras partes podem usar
  README.md      o que a feature faz e a tabela de arquivos
  pages/  components/  hooks/  api/  schemas/
  textos.ts      frases da interface
```

Dentro da feature, use imports relativos. Entre features, só pelo index.ts (o lint bloqueia o resto).
