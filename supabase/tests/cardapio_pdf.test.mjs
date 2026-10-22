import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const SEM_ACESSO = ID(3)
const FECHADO = ID(61)
const RASCUNHO = ID(62)
const ABERTO = ID(63)
const pdfs = `select coalesce(string_agg(name, ',' order by name), '') from storage.objects where bucket_id = 'cardapios'`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'a@t.com'),($3,'s@t.com')`,
    [ADMIN, ALUNA, SEM_ACESSO],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.temas set publicado = true;
    update public.perfis set acesso_inicio_em = now() - interval '3 days' where id = '${ALUNA}';
    insert into public.cardapios (id, objetivo, titulo, publicado, pdf_path, pdf_nome) values
      ('${FECHADO}', 'Emagrecimento', 'Semana leve', true, 'a.pdf', 'a.pdf'),
      ('${RASCUNHO}', 'Preparação', 'Ainda não', false, 'b.pdf', 'b.pdf'),
      ('${ABERTO}', 'Preparação', 'Primeira semana', true, 'c.pdf', 'c.pdf');
  `)
}

async function regras(t) {
  const { esperaValor, esperaErro } = t
  await esperaValor(
    'bucket só aceita PDF',
    `select allowed_mime_types = array['application/pdf'] from storage.buckets where id = 'cardapios'`,
    true,
  )
  await t.comoAluna(ADMIN)
  await t.db.query(
    `insert into storage.objects (bucket_id, name) values ('cardapios', 'a.pdf'), ('cardapios', 'b.pdf'), ('cardapios', 'c.pdf')`,
  )
  await esperaValor('equipe vê todos os PDFs', pdfs, 'a.pdf,b.pdf,c.pdf')
  await t.comoAluna(ALUNA)
  await esperaValor('aluna baixa só o PDF de cardápio publicado do tema aberto', pdfs, 'c.pdf')
  await esperaErro(
    'aluna não envia PDF',
    `insert into storage.objects (bucket_id, name) values ('cardapios', 'x.pdf')`,
    '42501',
  )
  await t.comoAluna(SEM_ACESSO)
  await esperaValor('sem acesso não baixa nada', pdfs, '')
}

export async function testarCardapioPdf() {
  const t = await criarBanco()
  await montar(t.db)
  await regras(t)
  return t.fim('PDF do cardápio')
}
