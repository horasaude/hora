export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      alimentos: {
        Row: {
          busca: string | null
          carboidrato: number | null
          codigo_taco: number | null
          created_at: string
          fibra: number | null
          gordura: number | null
          grupo: string
          id: string
          kcal: number | null
          nome: string
          origem: string
          proteina: number | null
          updated_at: string
        }
        Insert: {
          busca?: string | null
          carboidrato?: number | null
          codigo_taco?: number | null
          created_at?: string
          fibra?: number | null
          gordura?: number | null
          grupo?: string
          id?: string
          kcal?: number | null
          nome: string
          origem?: string
          proteina?: number | null
          updated_at?: string
        }
        Update: {
          busca?: string | null
          carboidrato?: number | null
          codigo_taco?: number | null
          created_at?: string
          fibra?: number | null
          gordura?: number | null
          grupo?: string
          id?: string
          kcal?: number | null
          nome?: string
          origem?: string
          proteina?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      aulas: {
        Row: {
          created_at: string
          descricao: string
          dia_liberacao: number
          duracao_minutos: number | null
          etapa_id: string
          id: string
          material_url: string | null
          ordem: number
          profissional: string | null
          publicado: boolean
          titulo: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          descricao?: string
          dia_liberacao: number
          duracao_minutos?: number | null
          etapa_id: string
          id?: string
          material_url?: string | null
          ordem?: number
          profissional?: string | null
          publicado?: boolean
          titulo: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          descricao?: string
          dia_liberacao?: number
          duracao_minutos?: number | null
          etapa_id?: string
          id?: string
          material_url?: string | null
          ordem?: number
          profissional?: string | null
          publicado?: boolean
          titulo?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "aulas_etapa_id_fkey"
            columns: ["etapa_id"]
            isOneToOne: false
            referencedRelation: "etapas"
            referencedColumns: ["id"]
          },
        ]
      }
      aulas_concluidas: {
        Row: {
          aula_id: string
          created_at: string
          perfil_id: string
        }
        Insert: {
          aula_id: string
          created_at?: string
          perfil_id?: string
        }
        Update: {
          aula_id?: string
          created_at?: string
          perfil_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "aulas_concluidas_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "aulas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aulas_concluidas_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      avisos: {
        Row: {
          created_at: string
          id: string
          publicado: boolean
          publicar_em: string
          texto: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          publicado?: boolean
          publicar_em?: string
          texto: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          publicado?: boolean
          publicar_em?: string
          texto?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      cardapios: {
        Row: {
          busca: string | null
          created_at: string
          descricao: string
          id: string
          lista_compras: Json
          modelo: string
          objetivo: string
          publicado: boolean
          refeicoes: Json
          titulo: string
          updated_at: string
        }
        Insert: {
          busca?: string | null
          created_at?: string
          descricao?: string
          id?: string
          lista_compras?: Json
          modelo?: string
          objetivo: string
          publicado?: boolean
          refeicoes?: Json
          titulo: string
          updated_at?: string
        }
        Update: {
          busca?: string | null
          created_at?: string
          descricao?: string
          id?: string
          lista_compras?: Json
          modelo?: string
          objetivo?: string
          publicado?: boolean
          refeicoes?: Json
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      checkins: {
        Row: {
          created_at: string
          dia: string
          duracao_minutos: number | null
          foto_apagada_em: string | null
          foto_path: string | null
          id: string
          invalidado_em: string | null
          invalidado_por: string | null
          motivo_invalidacao: string | null
          perfil_id: string
          tipo: string
          tipo_treino: string | null
        }
        Insert: {
          created_at?: string
          dia?: string
          duracao_minutos?: number | null
          foto_apagada_em?: string | null
          foto_path?: string | null
          id?: string
          invalidado_em?: string | null
          invalidado_por?: string | null
          motivo_invalidacao?: string | null
          perfil_id: string
          tipo: string
          tipo_treino?: string | null
        }
        Update: {
          created_at?: string
          dia?: string
          duracao_minutos?: number | null
          foto_apagada_em?: string | null
          foto_path?: string | null
          id?: string
          invalidado_em?: string | null
          invalidado_por?: string | null
          motivo_invalidacao?: string | null
          perfil_id?: string
          tipo?: string
          tipo_treino?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checkins_invalidado_por_fkey"
            columns: ["invalidado_por"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkins_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      comece_aqui: {
        Row: {
          id: boolean
          texto: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          id?: boolean
          texto?: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          id?: boolean
          texto?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      comece_aqui_feitos: {
        Row: {
          created_at: string
          item: string
          perfil_id: string
        }
        Insert: {
          created_at?: string
          item: string
          perfil_id?: string
        }
        Update: {
          created_at?: string
          item?: string
          perfil_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comece_aqui_feitos_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes: {
        Row: {
          id: boolean
          oferta_fim: string
          oferta_inicio: string
          parcelado_cheio: number
          parcelado_oferta: number
          pix_cheio: number
          pix_oferta: number
          privacidade: Json
          privacidade_atualizado_em: string
          recorrente_cheio: number
          recorrente_oferta: number
          termos: Json
          termos_atualizado_em: string
          updated_at: string
        }
        Insert: {
          id?: boolean
          oferta_fim: string
          oferta_inicio: string
          parcelado_cheio: number
          parcelado_oferta: number
          pix_cheio: number
          pix_oferta: number
          privacidade: Json
          privacidade_atualizado_em?: string
          recorrente_cheio: number
          recorrente_oferta: number
          termos: Json
          termos_atualizado_em?: string
          updated_at?: string
        }
        Update: {
          id?: boolean
          oferta_fim?: string
          oferta_inicio?: string
          parcelado_cheio?: number
          parcelado_oferta?: number
          pix_cheio?: number
          pix_oferta?: number
          privacidade?: Json
          privacidade_atualizado_em?: string
          recorrente_cheio?: number
          recorrente_oferta?: number
          termos?: Json
          termos_atualizado_em?: string
          updated_at?: string
        }
        Relationships: []
      }
      denuncias_checkin: {
        Row: {
          checkin_id: string
          created_at: string
          perfil_id: string
        }
        Insert: {
          checkin_id: string
          created_at?: string
          perfil_id?: string
        }
        Update: {
          checkin_id?: string
          created_at?: string
          perfil_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "denuncias_checkin_checkin_id_fkey"
            columns: ["checkin_id"]
            isOneToOne: false
            referencedRelation: "checkins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "denuncias_checkin_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      desafio_checkins: {
        Row: {
          created_at: string
          desafio_id: string
          dia: string
          foto_path: string | null
          perfil_id: string
          valor: number | null
        }
        Insert: {
          created_at?: string
          desafio_id: string
          dia?: string
          foto_path?: string | null
          perfil_id?: string
          valor?: number | null
        }
        Update: {
          created_at?: string
          desafio_id?: string
          dia?: string
          foto_path?: string | null
          perfil_id?: string
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "desafio_checkins_desafio_id_fkey"
            columns: ["desafio_id"]
            isOneToOne: false
            referencedRelation: "desafios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desafio_checkins_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      desafio_participantes: {
        Row: {
          desafio_id: string
          entrou_em: string
          perfil_id: string
        }
        Insert: {
          desafio_id: string
          entrou_em?: string
          perfil_id?: string
        }
        Update: {
          desafio_id?: string
          entrou_em?: string
          perfil_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "desafio_participantes_desafio_id_fkey"
            columns: ["desafio_id"]
            isOneToOne: false
            referencedRelation: "desafios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desafio_participantes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      desafios: {
        Row: {
          bonus_conclusao: number
          created_at: string
          descricao: string
          encerrado_em: string | null
          fim: string
          id: string
          inicio: string
          meta_diaria: number | null
          meta_dias: number
          nome: string
          pontos_por_dia: number
          premio: string
          premio_surpresa: boolean
          publicado: boolean
          publico: Database["public"]["Enums"]["publico_desafio"]
          tipo_checkin: Database["public"]["Enums"]["tipo_checkin"]
          unidade: string | null
          updated_at: string
        }
        Insert: {
          bonus_conclusao?: number
          created_at?: string
          descricao?: string
          encerrado_em?: string | null
          fim: string
          id?: string
          inicio: string
          meta_diaria?: number | null
          meta_dias: number
          nome: string
          pontos_por_dia?: number
          premio?: string
          premio_surpresa?: boolean
          publicado?: boolean
          publico?: Database["public"]["Enums"]["publico_desafio"]
          tipo_checkin: Database["public"]["Enums"]["tipo_checkin"]
          unidade?: string | null
          updated_at?: string
        }
        Update: {
          bonus_conclusao?: number
          created_at?: string
          descricao?: string
          encerrado_em?: string | null
          fim?: string
          id?: string
          inicio?: string
          meta_diaria?: number | null
          meta_dias?: number
          nome?: string
          pontos_por_dia?: number
          premio?: string
          premio_surpresa?: boolean
          publicado?: boolean
          publico?: Database["public"]["Enums"]["publico_desafio"]
          tipo_checkin?: Database["public"]["Enums"]["tipo_checkin"]
          unidade?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      etapas: {
        Row: {
          chave: string | null
          created_at: string
          descricao: string
          id: string
          ordem: number
          publicado: boolean
          tema_id: string
          titulo: string
          updated_at: string
        }
        Insert: {
          chave?: string | null
          created_at?: string
          descricao?: string
          id?: string
          ordem: number
          publicado?: boolean
          tema_id: string
          titulo: string
          updated_at?: string
        }
        Update: {
          chave?: string | null
          created_at?: string
          descricao?: string
          id?: string
          ordem?: number
          publicado?: boolean
          tema_id?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "etapas_tema_id_fkey"
            columns: ["tema_id"]
            isOneToOne: false
            referencedRelation: "temas"
            referencedColumns: ["id"]
          },
        ]
      }
      etapas_iniciadas: {
        Row: {
          etapa_id: string
          iniciada_em: string
          perfil_id: string
        }
        Insert: {
          etapa_id: string
          iniciada_em?: string
          perfil_id: string
        }
        Update: {
          etapa_id?: string
          iniciada_em?: string
          perfil_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "etapas_iniciadas_etapa_id_fkey"
            columns: ["etapa_id"]
            isOneToOne: false
            referencedRelation: "etapas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "etapas_iniciadas_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_curtidas: {
        Row: {
          created_at: string
          perfil_id: string
          resposta_id: string
        }
        Insert: {
          created_at?: string
          perfil_id: string
          resposta_id: string
        }
        Update: {
          created_at?: string
          perfil_id?: string
          resposta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_curtidas_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_curtidas_resposta_id_fkey"
            columns: ["resposta_id"]
            isOneToOne: false
            referencedRelation: "forum_respostas"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_denuncias: {
        Row: {
          created_at: string
          id: string
          motivo: string | null
          perfil_id: string
          resolucao: string | null
          resolvida_em: string | null
          resposta_id: string | null
          topico_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          motivo?: string | null
          perfil_id: string
          resolucao?: string | null
          resolvida_em?: string | null
          resposta_id?: string | null
          topico_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          motivo?: string | null
          perfil_id?: string
          resolucao?: string | null
          resolvida_em?: string | null
          resposta_id?: string | null
          topico_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_denuncias_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_denuncias_resposta_id_fkey"
            columns: ["resposta_id"]
            isOneToOne: false
            referencedRelation: "forum_respostas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_denuncias_topico_id_fkey"
            columns: ["topico_id"]
            isOneToOne: false
            referencedRelation: "forum_topicos"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_respostas: {
        Row: {
          created_at: string
          da_equipe: boolean
          id: string
          motivo_ocultar: string | null
          oculto_em: string | null
          oculto_por: string | null
          perfil_id: string
          texto: string
          topico_id: string
        }
        Insert: {
          created_at?: string
          da_equipe?: boolean
          id?: string
          motivo_ocultar?: string | null
          oculto_em?: string | null
          oculto_por?: string | null
          perfil_id: string
          texto: string
          topico_id: string
        }
        Update: {
          created_at?: string
          da_equipe?: boolean
          id?: string
          motivo_ocultar?: string | null
          oculto_em?: string | null
          oculto_por?: string | null
          perfil_id?: string
          texto?: string
          topico_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_respostas_oculto_por_fkey"
            columns: ["oculto_por"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_respostas_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_respostas_topico_id_fkey"
            columns: ["topico_id"]
            isOneToOne: false
            referencedRelation: "forum_topicos"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topicos: {
        Row: {
          aula_id: string | null
          categoria: string
          created_at: string
          id: string
          motivo_ocultar: string | null
          oculto_em: string | null
          oculto_por: string | null
          perfil_id: string
          prazo_em: string
          respondida_em: string | null
          respondida_por: string | null
          resposta_vista_em: string | null
          texto: string
          ultima_resposta_equipe_em: string | null
          util_em: string | null
          util_por: string | null
        }
        Insert: {
          aula_id?: string | null
          categoria: string
          created_at?: string
          id?: string
          motivo_ocultar?: string | null
          oculto_em?: string | null
          oculto_por?: string | null
          perfil_id: string
          prazo_em?: string
          respondida_em?: string | null
          respondida_por?: string | null
          resposta_vista_em?: string | null
          texto: string
          ultima_resposta_equipe_em?: string | null
          util_em?: string | null
          util_por?: string | null
        }
        Update: {
          aula_id?: string | null
          categoria?: string
          created_at?: string
          id?: string
          motivo_ocultar?: string | null
          oculto_em?: string | null
          oculto_por?: string | null
          perfil_id?: string
          prazo_em?: string
          respondida_em?: string | null
          respondida_por?: string | null
          resposta_vista_em?: string | null
          texto?: string
          ultima_resposta_equipe_em?: string | null
          util_em?: string | null
          util_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_topicos_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "aulas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_topicos_oculto_por_fkey"
            columns: ["oculto_por"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_topicos_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_topicos_respondida_por_fkey"
            columns: ["respondida_por"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_topicos_util_por_fkey"
            columns: ["util_por"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      indicacoes: {
        Row: {
          compra_confirmada_em: string
          created_at: string
          garantia_ate: string
          id: string
          indicada_cpf: string | null
          indicada_email: string
          indicada_id: string | null
          indicada_nome: string
          indicadora_id: string
          motivo_cancelamento: string | null
          status: string
        }
        Insert: {
          compra_confirmada_em?: string
          created_at?: string
          garantia_ate?: string
          id?: string
          indicada_cpf?: string | null
          indicada_email: string
          indicada_id?: string | null
          indicada_nome?: string
          indicadora_id: string
          motivo_cancelamento?: string | null
          status?: string
        }
        Update: {
          compra_confirmada_em?: string
          created_at?: string
          garantia_ate?: string
          id?: string
          indicada_cpf?: string | null
          indicada_email?: string
          indicada_id?: string | null
          indicada_nome?: string
          indicadora_id?: string
          motivo_cancelamento?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicacoes_indicada_id_fkey"
            columns: ["indicada_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicacoes_indicadora_id_fkey"
            columns: ["indicadora_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      interessadas: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          origem: string | null
          plano_escolhido: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          whatsapp: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome: string
          origem?: string | null
          plano_escolhido: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          whatsapp: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          origem?: string | null
          plano_escolhido?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      lancamentos_pontos: {
        Row: {
          acao: string
          created_at: string
          criado_por: string | null
          dia: string
          estorna: string | null
          id: string
          motivo: string | null
          origem: string
          perfil_id: string
          pontos: number
          referencia: string | null
        }
        Insert: {
          acao: string
          created_at?: string
          criado_por?: string | null
          dia?: string
          estorna?: string | null
          id?: string
          motivo?: string | null
          origem: string
          perfil_id: string
          pontos: number
          referencia?: string | null
        }
        Update: {
          acao?: string
          created_at?: string
          criado_por?: string | null
          dia?: string
          estorna?: string | null
          id?: string
          motivo?: string | null
          origem?: string
          perfil_id?: string
          pontos?: number
          referencia?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_pontos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_pontos_estorna_fkey"
            columns: ["estorna"]
            isOneToOne: true
            referencedRelation: "lancamentos_pontos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_pontos_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      lista_compras_marcados: {
        Row: {
          cardapio_id: string
          created_at: string
          item: string
          perfil_id: string
        }
        Insert: {
          cardapio_id: string
          created_at?: string
          item: string
          perfil_id?: string
        }
        Update: {
          cardapio_id?: string
          created_at?: string
          item?: string
          perfil_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lista_compras_marcados_cardapio_id_fkey"
            columns: ["cardapio_id"]
            isOneToOne: false
            referencedRelation: "cardapios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lista_compras_marcados_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      lives: {
        Row: {
          capa_url: string | null
          convidada: string | null
          created_at: string
          data: string
          duracao_minutos: number
          gravacao_url: string | null
          id: string
          link_url: string | null
          profissional: string | null
          publicado: boolean
          tema: string
          updated_at: string
        }
        Insert: {
          capa_url?: string | null
          convidada?: string | null
          created_at?: string
          data: string
          duracao_minutos?: number
          gravacao_url?: string | null
          id?: string
          link_url?: string | null
          profissional?: string | null
          publicado?: boolean
          tema: string
          updated_at?: string
        }
        Update: {
          capa_url?: string | null
          convidada?: string | null
          created_at?: string
          data?: string
          duracao_minutos?: number
          gravacao_url?: string | null
          id?: string
          link_url?: string | null
          profissional?: string | null
          publicado?: boolean
          tema?: string
          updated_at?: string
        }
        Relationships: []
      }
      lives_lembretes: {
        Row: {
          created_at: string
          live_id: string
          perfil_id: string
        }
        Insert: {
          created_at?: string
          live_id: string
          perfil_id?: string
        }
        Update: {
          created_at?: string
          live_id?: string
          perfil_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lives_lembretes_live_id_fkey"
            columns: ["live_id"]
            isOneToOne: false
            referencedRelation: "lives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lives_lembretes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      lives_presencas: {
        Row: {
          created_at: string
          live_id: string
          perfil_id: string
        }
        Insert: {
          created_at?: string
          live_id: string
          perfil_id: string
        }
        Update: {
          created_at?: string
          live_id?: string
          perfil_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lives_presencas_live_id_fkey"
            columns: ["live_id"]
            isOneToOne: false
            referencedRelation: "lives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lives_presencas_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      loja_cliques: {
        Row: {
          created_at: string
          id: number
          perfil_id: string
          produto_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          perfil_id: string
          produto_id: string
        }
        Update: {
          created_at?: string
          id?: never
          perfil_id?: string
          produto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loja_cliques_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loja_cliques_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "loja_produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      loja_parceiros: {
        Row: {
          ativo: boolean
          created_at: string
          cupom: string | null
          descricao: string
          id: string
          logo_path: string | null
          nome: string
          site_url: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          cupom?: string | null
          descricao?: string
          id?: string
          logo_path?: string | null
          nome: string
          site_url?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          cupom?: string | null
          descricao?: string
          id?: string
          logo_path?: string | null
          nome?: string
          site_url?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      loja_produtos: {
        Row: {
          categoria: string
          created_at: string
          cupom: string | null
          descricao: string
          destaque: boolean
          foto_path: string | null
          id: string
          link_url: string
          nome: string
          parceiro_id: string
          preco_centavos: number
          preco_final_centavos: number
          publicado: boolean
          updated_at: string
        }
        Insert: {
          categoria: string
          created_at?: string
          cupom?: string | null
          descricao?: string
          destaque?: boolean
          foto_path?: string | null
          id?: string
          link_url: string
          nome: string
          parceiro_id: string
          preco_centavos: number
          preco_final_centavos: number
          publicado?: boolean
          updated_at?: string
        }
        Update: {
          categoria?: string
          created_at?: string
          cupom?: string | null
          descricao?: string
          destaque?: boolean
          foto_path?: string | null
          id?: string
          link_url?: string
          nome?: string
          parceiro_id?: string
          preco_centavos?: number
          preco_final_centavos?: number
          publicado?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loja_produtos_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "loja_parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      medidas: {
        Row: {
          braco: number | null
          cintura: number | null
          coxa: number | null
          created_at: string
          dia: string
          foto_path: string | null
          id: string
          perfil_id: string
          peso: number | null
          quadril: number | null
        }
        Insert: {
          braco?: number | null
          cintura?: number | null
          coxa?: number | null
          created_at?: string
          dia?: string
          foto_path?: string | null
          id?: string
          perfil_id?: string
          peso?: number | null
          quadril?: number | null
        }
        Update: {
          braco?: number | null
          cintura?: number | null
          coxa?: number | null
          created_at?: string
          dia?: string
          foto_path?: string | null
          id?: string
          perfil_id?: string
          peso?: number | null
          quadril?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medidas_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      medidas_caseiras: {
        Row: {
          alimento_id: string
          gramas: number
          id: string
          nome: string
          ordem: number
        }
        Insert: {
          alimento_id: string
          gramas: number
          id?: string
          nome: string
          ordem?: number
        }
        Update: {
          alimento_id?: string
          gramas?: number
          id?: string
          nome?: string
          ordem?: number
        }
        Relationships: [
          {
            foreignKeyName: "medidas_caseiras_alimento_id_fkey"
            columns: ["alimento_id"]
            isOneToOne: false
            referencedRelation: "alimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          acesso_fim_em: string | null
          acesso_inicio_em: string | null
          apelido: string | null
          avatar_path: string | null
          codigo_indicacao: string
          consentimento_saude_em: string | null
          cpf: string | null
          created_at: string
          especialidade: string | null
          forum_regras_em: string | null
          foto_path: string | null
          id: string
          nome: string
          ocultar_ranking: boolean
          papel: Database["public"]["Enums"]["papel"]
          tema_atual_id: string | null
          titulo_profissional: string | null
          ultimo_acesso_em: string | null
          updated_at: string
        }
        Insert: {
          acesso_fim_em?: string | null
          acesso_inicio_em?: string | null
          apelido?: string | null
          avatar_path?: string | null
          codigo_indicacao?: string
          consentimento_saude_em?: string | null
          cpf?: string | null
          created_at?: string
          especialidade?: string | null
          forum_regras_em?: string | null
          foto_path?: string | null
          id: string
          nome?: string
          ocultar_ranking?: boolean
          papel?: Database["public"]["Enums"]["papel"]
          tema_atual_id?: string | null
          titulo_profissional?: string | null
          ultimo_acesso_em?: string | null
          updated_at?: string
        }
        Update: {
          acesso_fim_em?: string | null
          acesso_inicio_em?: string | null
          apelido?: string | null
          avatar_path?: string | null
          codigo_indicacao?: string
          consentimento_saude_em?: string | null
          cpf?: string | null
          created_at?: string
          especialidade?: string | null
          forum_regras_em?: string | null
          foto_path?: string | null
          id?: string
          nome?: string
          ocultar_ranking?: boolean
          papel?: Database["public"]["Enums"]["papel"]
          tema_atual_id?: string | null
          titulo_profissional?: string | null
          ultimo_acesso_em?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfis_tema_atual_id_fkey"
            columns: ["tema_atual_id"]
            isOneToOne: false
            referencedRelation: "temas"
            referencedColumns: ["id"]
          },
        ]
      }
      receita_itens: {
        Row: {
          alimento_id: string
          gramas: number
          id: string
          ordem: number
          receita_id: string
        }
        Insert: {
          alimento_id: string
          gramas: number
          id?: string
          ordem?: number
          receita_id: string
        }
        Update: {
          alimento_id?: string
          gramas?: number
          id?: string
          ordem?: number
          receita_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receita_itens_alimento_id_fkey"
            columns: ["alimento_id"]
            isOneToOne: false
            referencedRelation: "alimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receita_itens_receita_id_fkey"
            columns: ["receita_id"]
            isOneToOne: false
            referencedRelation: "receitas"
            referencedColumns: ["id"]
          },
        ]
      }
      receitas: {
        Row: {
          busca: string | null
          calcular: boolean
          created_at: string
          foto_path: string | null
          id: string
          ingredientes: string
          nome: string
          objetivos: string[]
          porcoes: number
          preparo: string
          publicado: boolean
          refeicoes: string[]
          tags: string[]
          tempo_minutos: number | null
          updated_at: string
        }
        Insert: {
          busca?: string | null
          calcular?: boolean
          created_at?: string
          foto_path?: string | null
          id?: string
          ingredientes?: string
          nome: string
          objetivos?: string[]
          porcoes?: number
          preparo?: string
          publicado?: boolean
          refeicoes?: string[]
          tags?: string[]
          tempo_minutos?: number | null
          updated_at?: string
        }
        Update: {
          busca?: string | null
          calcular?: boolean
          created_at?: string
          foto_path?: string | null
          id?: string
          ingredientes?: string
          nome?: string
          objetivos?: string[]
          porcoes?: number
          preparo?: string
          publicado?: boolean
          refeicoes?: string[]
          tags?: string[]
          tempo_minutos?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      receitas_favoritas: {
        Row: {
          created_at: string
          perfil_id: string
          receita_id: string
        }
        Insert: {
          created_at?: string
          perfil_id?: string
          receita_id: string
        }
        Update: {
          created_at?: string
          perfil_id?: string
          receita_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receitas_favoritas_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receitas_favoritas_receita_id_fkey"
            columns: ["receita_id"]
            isOneToOne: false
            referencedRelation: "receitas"
            referencedColumns: ["id"]
          },
        ]
      }
      refeicoes_modelo: {
        Row: {
          busca: string | null
          created_at: string
          horario: string | null
          id: string
          itens: Json
          nome: string
          observacao: string
          tipo: Database["public"]["Enums"]["tipo_refeicao"]
          updated_at: string
        }
        Insert: {
          busca?: string | null
          created_at?: string
          horario?: string | null
          id?: string
          itens?: Json
          nome: string
          observacao?: string
          tipo: Database["public"]["Enums"]["tipo_refeicao"]
          updated_at?: string
        }
        Update: {
          busca?: string | null
          created_at?: string
          horario?: string | null
          id?: string
          itens?: Json
          nome?: string
          observacao?: string
          tipo?: Database["public"]["Enums"]["tipo_refeicao"]
          updated_at?: string
        }
        Relationships: []
      }
      regras_pontos: {
        Row: {
          acao: string
          ativo: boolean
          limite_qtd: number | null
          limite_tipo: string
          nome: string
          ordem: number
          pontos: number
          propria: boolean
          updated_at: string
        }
        Insert: {
          acao: string
          ativo?: boolean
          limite_qtd?: number | null
          limite_tipo: string
          nome: string
          ordem?: number
          pontos: number
          propria?: boolean
          updated_at?: string
        }
        Update: {
          acao?: string
          ativo?: boolean
          limite_qtd?: number | null
          limite_tipo?: string
          nome?: string
          ordem?: number
          pontos?: number
          propria?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      temas: {
        Row: {
          chave: string | null
          created_at: string
          descricao: string
          id: string
          ordem: number
          publicado: boolean
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          chave?: string | null
          created_at?: string
          descricao?: string
          id?: string
          ordem?: number
          publicado?: boolean
          tipo?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          chave?: string | null
          created_at?: string
          descricao?: string
          id?: string
          ordem?: number
          publicado?: boolean
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      alunas_em_desafios_ativos: { Args: never; Returns: number }
      atualizar_etapas: { Args: { p_perfil: string }; Returns: undefined }
      aula_liberada: { Args: { p_aula: string }; Returns: boolean }
      aulas_da_etapa: { Args: { p_etapa: string }; Returns: Json }
      cancelar_indicacao: {
        Args: { p_indicacao: string; p_motivo: string }
        Returns: undefined
      }
      checkin_desafio: {
        Args: { p_desafio: string; p_foto_path?: string; p_valor?: number }
        Returns: number
      }
      cliques_por_semana: {
        Args: { p_produto: string; p_semanas?: number }
        Returns: {
          cliques: number
          semana: string
        }[]
      }
      conceder_pontos: {
        Args: {
          p_acao: string
          p_criado_por?: string
          p_motivo?: string
          p_origem: string
          p_perfil: string
          p_pontos?: number
          p_referencia?: string
        }
        Returns: string
      }
      confirmar_indicacoes: { Args: never; Returns: number }
      criar_acao: {
        Args: {
          p_limite_qtd: number
          p_limite_tipo: string
          p_nome: string
          p_pontos: number
        }
        Returns: string
      }
      dar_pontos_acao: {
        Args: { p_acao: string; p_perfis: string[] }
        Returns: number
      }
      dia_atual_de: {
        Args: { p_agora: string; p_inicio: string }
        Returns: number
      }
      dia_de_acesso: { Args: never; Returns: number }
      dias_cumpridos: {
        Args: { p_desafio: string; p_perfil: string }
        Returns: number
      }
      duplicar_alimento: { Args: { p_id: string }; Returns: string }
      editar_profissional: {
        Args: {
          p_especialidade: string
          p_nome: string
          p_perfil: string
          p_titulo: string
        }
        Returns: undefined
      }
      eh_admin: { Args: never; Returns: boolean }
      entrar_desafio: { Args: { p_desafio: string }; Returns: undefined }
      entrar_live: { Args: { p_live: string }; Returns: Json }
      escolher_tema: { Args: { p_tema: string }; Returns: undefined }
      estornar_lancamento: {
        Args: { p_criado_por: string; p_lancamento: string; p_motivo: string }
        Returns: string
      }
      etapa_pode_avancar: {
        Args: { p_etapa: string; p_perfil: string }
        Returns: boolean
      }
      fazer_checkin: {
        Args: {
          p_duracao?: number
          p_foto_path?: string
          p_tipo: string
          p_tipo_treino?: string
        }
        Returns: {
          id: string
          pontos: number
        }[]
      }
      forum_aceitar_regras: { Args: never; Returns: undefined }
      forum_curtir: {
        Args: { p_curtir: boolean; p_resposta: string }
        Returns: undefined
      }
      forum_denunciar: {
        Args: { p_motivo?: string; p_resposta: string; p_topico: string }
        Returns: undefined
      }
      forum_exigir_acesso: { Args: never; Returns: boolean }
      forum_listar: {
        Args: {
          p_aula?: string
          p_busca?: string
          p_categoria?: string
          p_id?: string
          p_limite?: number
          p_minhas?: boolean
        }
        Returns: {
          aula_id: string
          aula_titulo: string
          autora: string
          categoria: string
          created_at: string
          id: string
          minha: boolean
          oculto: boolean
          prazo_em: string
          respondida_em: string
          respostas: Json
          texto: string
          total_respostas: number
          util: boolean
        }[]
      }
      forum_manter: {
        Args: { p_resposta: string; p_topico: string }
        Returns: undefined
      }
      forum_marcar_util: { Args: { p_topico: string }; Returns: boolean }
      forum_marcar_vista: { Args: { p_topico: string }; Returns: undefined }
      forum_minhas_respondidas: {
        Args: never
        Returns: {
          id: string
          respondida_em: string
          texto: string
        }[]
      }
      forum_ocultar: {
        Args: { p_motivo: string; p_resposta: string; p_topico: string }
        Returns: undefined
      }
      forum_perguntar: {
        Args: { p_aula?: string; p_categoria: string; p_texto: string }
        Returns: string
      }
      forum_responder: {
        Args: { p_texto: string; p_topico: string }
        Returns: string
      }
      hoje_brasilia: { Args: never; Returns: string }
      invalidar_checkin: {
        Args: { p_checkin: string; p_motivo: string }
        Returns: number
      }
      lancar_ajuste: {
        Args: { p_motivo: string; p_perfil: string; p_pontos: number }
        Returns: string
      }
      marcar_fotos_apagadas: { Args: { p_ids: string[] }; Returns: undefined }
      meus_desafios: {
        Args: never
        Returns: {
          bonus_conclusao: number
          descricao: string
          dias_feitos: number
          encerrado: boolean
          feito_hoje: boolean
          fim: string
          id: string
          inicio: string
          meta_diaria: number
          meta_dias: number
          nome: string
          participando: boolean
          participantes: number
          pontos_por_dia: number
          premio: string
          premio_surpresa: boolean
          tipo_checkin: string
          unidade: string
        }[]
      }
      mover_aula: {
        Args: { p_direcao: number; p_id: string }
        Returns: undefined
      }
      mover_etapa: {
        Args: { p_direcao: number; p_id: string }
        Returns: undefined
      }
      mover_tema: {
        Args: { p_direcao: number; p_id: string }
        Returns: undefined
      }
      objetivo_da_aluna: { Args: never; Returns: string }
      painel_alunas: {
        Args: never
        Returns: {
          acesso_fim_em: string
          acesso_inicio_em: string
          apelido: string
          aulas_concluidas: number
          aulas_liberadas: number
          dia: number
          id: string
          nome: string
          ultimo_acesso_em: string
        }[]
      }
      painel_denuncias_forum: {
        Args: never
        Returns: {
          autora: string
          motivos: string[]
          resposta_id: string
          texto: string
          topico_id: string
          total: number
          ultima: string
        }[]
      }
      painel_desafios: {
        Args: never
        Returns: {
          concluintes: number
          id: string
          participantes: number
        }[]
      }
      painel_equipe: {
        Args: never
        Returns: {
          convite_pendente: boolean
          email: string
          especialidade: string
          eu: boolean
          foto_path: string
          id: string
          nome: string
          titulo_profissional: string
          ultimo_acesso: string
        }[]
      }
      painel_forum: {
        Args: never
        Returns: {
          abertas: number
          perto: number
          respondidas_semana: number
          vencidas: number
        }[]
      }
      painel_loja: {
        Args: never
        Returns: {
          cliques_mes: number
          mais_clicado: string
          mais_clicado_cliques: number
          parceiros_ativos: number
          publicados: number
        }[]
      }
      painel_pontos: {
        Args: never
        Returns: {
          checkins_hoje: number
          fotos_denunciadas: number
          indicacoes_mes: number
          pontos_mes: number
        }[]
      }
      participantes_desafio: {
        Args: { p_desafio: string }
        Returns: {
          apelido: string
          dias: number
          meta: number
          nome: string
          perfil_id: string
        }[]
      }
      ranking_desafio: {
        Args: { p_desafio: string }
        Returns: {
          apelido: string
          dias: number
          eu: boolean
          posicao: number
        }[]
      }
      ranking_pontos: {
        Args: { p_periodo: string }
        Returns: {
          apelido: string
          eu: boolean
          pontos: number
          posicao: number
        }[]
      }
      registrar_acesso: { Args: never; Returns: undefined }
      registrar_clique_loja: { Args: { p_produto: string }; Returns: undefined }
      registrar_indicacao: {
        Args: {
          p_codigo: string
          p_cpf: string
          p_email: string
          p_indicada?: string
          p_nome: string
        }
        Returns: string
      }
      remover_profissional: { Args: { p_perfil: string }; Returns: undefined }
      salvar_alimento: {
        Args: { p_alimento: Json; p_medidas: Json }
        Returns: string
      }
      salvar_perfil_equipe: {
        Args: {
          p_especialidade: string
          p_foto_path: string
          p_nome: string
          p_titulo: string
        }
        Returns: undefined
      }
      salvar_receita_itens: {
        Args: { p_itens: Json; p_receita: string }
        Returns: undefined
      }
      tem_acesso_ativo: { Args: never; Returns: boolean }
      texto_busca: { Args: { valor: string }; Returns: string }
      trilha_aluna: { Args: never; Returns: Json }
      vencedoras_desafio: {
        Args: { p_desafio: string }
        Returns: {
          apelido: string
          dias: number
          nome: string
          perfil_id: string
        }[]
      }
    }
    Enums: {
      papel: "aluna" | "admin"
      publico_desafio: "todas" | "inscritas"
      tipo_checkin: "sim_nao" | "foto" | "numero"
      tipo_refeicao:
        | "cafe"
        | "lanche"
        | "almoco"
        | "jantar"
        | "ceia"
        | "pre_treino"
        | "pos_treino"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      papel: ["aluna", "admin"],
      publico_desafio: ["todas", "inscritas"],
      tipo_checkin: ["sim_nao", "foto", "numero"],
      tipo_refeicao: [
        "cafe",
        "lanche",
        "almoco",
        "jantar",
        "ceia",
        "pre_treino",
        "pos_treino",
      ],
    },
  },
} as const
