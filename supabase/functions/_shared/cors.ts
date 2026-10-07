/** Origens liberadas vêm do secret ORIGENS_PERMITIDAS, separadas por vírgula. */
function origens(): string[] {
  return (Deno.env.get('ORIGENS_PERMITIDAS') ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
}

export function origemPermitida(origem: string): boolean {
  return origem !== '' && origens().includes(origem)
}

export function cabecalhosCors(origem: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origem,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}
