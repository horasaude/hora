// Payment Brick de mentira para os testes: fica pronto na hora e devolve um cartão de teste.
type Ajustes = { callbacks: { onReady: () => void } }

export const brickFalso = {
  create: async (_nome: string, _id: string, ajustes: Ajustes) => {
    ajustes.callbacks.onReady()
    return {
      getFormData: async () => ({ formData: { token: 'tok_teste', payment_method_id: 'master' } }),
      unmount: () => undefined,
    }
  },
}
