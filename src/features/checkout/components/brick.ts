import type { Plano } from '@/domain/precos'

// Ajustes do Payment Brick na identidade do ORA: fundo branco, verde ORA e cantos arredondados.
// Só Pix no à vista; só cartão de crédito no parcelado (12x) e no mensal (1x por mês).

const ESTILO = {
  theme: 'default',
  customVariables: {
    formBackgroundColor: '#ffffff',
    inputBackgroundColor: '#ffffff',
    baseColor: '#2c4c44',
    baseColorFirstVariant: '#3a6158',
    baseColorSecondVariant: '#1f4a41',
    outlinePrimaryColor: '#2c4c44',
    textPrimaryColor: '#1e2925',
    textSecondaryColor: '#66736d',
    errorColor: '#a5573a',
    successColor: '#1fa86e',
    borderRadiusSmall: '8px',
    borderRadiusMedium: '12px',
    borderRadiusLarge: '16px',
    borderRadiusFull: '999px',
    formPadding: '0px',
  },
}

export function ajustesBrick(plano: Plano, centavos: number, email: string) {
  const metodos =
    plano === 'pix'
      ? { bankTransfer: ['pix'] }
      : {
          creditCard: 'all',
          minInstallments: plano === 'parcelado' ? 12 : 1,
          maxInstallments: plano === 'parcelado' ? 12 : 1,
        }
  return {
    initialization: { amount: centavos / 100, payer: email ? { email } : undefined },
    customization: {
      visual: { hidePaymentButton: true, hideFormTitle: true, style: ESTILO },
      paymentMethods: metodos,
    },
    locale: 'pt-BR',
  }
}
