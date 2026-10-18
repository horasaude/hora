import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const NOVA = ID(1)
const ANTIGA = ID(2)
const [APROVADO, COM_SENHA, PENDENTE] = [ID(101), ID(102), ID(103)]
const CODIGO = (n) => `11111111-0000-0000-0000-${String(n).padStart(12, '0')}`

const pedido = (id, n, status, perfil) => `
  insert into public.pedidos (id, nome, email, cpf, whatsapp, plano, valor_centavos, meses_acesso, status, perfil_id, codigo_acesso)
  values ('${id}', 'Ana Souza', 'ana@t.com', '52998224725', '11999998888', 'pix', 100, 12, '${status}', '${perfil}', '${CODIGO(n)}')`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email, encrypted_password) values ($1,'nova@t.com',''),($2,'antiga@t.com','$2a$10$hash')`,
    [NOVA, ANTIGA],
  )
  await db.exec(`
    ${pedido(APROVADO, 1, 'aprovado', NOVA)};
    ${pedido(COM_SENHA, 2, 'aprovado', ANTIGA)};
    ${pedido(PENDENTE, 3, 'pendente', NOVA)};
  `)
}

async function testes(t) {
  const { esperaValor, esperaErro } = t
  const link = (n, campo) => `select ${campo} from public.acesso_do_link('${CODIGO(n)}')`
  await t.comoAnon()
  await esperaErro('anônimo não usa o link pelo banco', link(1, 'email'), '42501')
  await t.comoAluna(NOVA)
  await esperaErro('aluna não usa o link pelo banco', link(1, 'email'), '42501')
  await t.comoServico()
  await esperaValor('link de quem ainda não tem senha', link(1, 'email'), 'nova@t.com')
  await esperaValor('sem senha criada', link(1, 'tem_senha'), false)
  await esperaValor('quem já criou a senha', link(2, 'tem_senha'), true)
  await esperaValor('pedido não aprovado não abre', link(3, 'count(*)::int'), 0)
  await esperaValor('código errado não abre', link(9, 'count(*)::int'), 0)
  await esperaValor(
    'todo pedido nasce com código',
    `select count(*)::int from public.pedidos where codigo_acesso is null`,
    0,
  )
}

export async function testarLinkAcesso() {
  const t = await criarBanco()
  await montar(t.db)
  await testes(t)
  return t.fim('link de acesso')
}
