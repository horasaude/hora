// Botão "Criar minha senha" do e-mail de boas-vindas (www.comunidadeora.com.br/acesso/<código>).
// Não vence: a cada clique gera um link novo do Supabase, enquanto a aluna ainda não criou a senha.
// Depois da senha criada, ou com código inválido, manda para o login.
import { servico, SITE } from '../_shared/servico.ts'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const ENTRAR = `${SITE}/entrar`

type Acesso = { email: string; tem_senha: boolean }

async function destino(codigo: string): Promise<string> {
  if (!UUID.test(codigo)) return ENTRAR
  const { data } = await servico.rpc('acesso_do_link', { p_codigo: codigo }).maybeSingle<Acesso>()
  if (!data || data.tem_senha) return ENTRAR
  const { data: link, error } = await servico.auth.admin.generateLink({
    type: 'recovery',
    email: data.email,
    options: { redirectTo: `${SITE}/definir-senha` },
  })
  if (error) throw new Error(`link de senha: ${error.message}`)
  return link.properties.action_link
}

Deno.serve(async (req) => {
  if (req.method !== 'GET') return new Response(null, { status: 405 })
  try {
    return Response.redirect(await destino(new URL(req.url).searchParams.get('c') ?? ''), 302)
  } catch (e) {
    console.error('primeiro-acesso', e instanceof Error ? e.message : e)
    return Response.redirect(ENTRAR, 302)
  }
})
