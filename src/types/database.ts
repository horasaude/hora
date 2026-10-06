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
      lives: {
        Row: {
          convidada: string | null
          created_at: string
          data: string
          gravacao_url: string | null
          id: string
          link_url: string | null
          publicado: boolean
          tema: string
          updated_at: string
        }
        Insert: {
          convidada?: string | null
          created_at?: string
          data: string
          gravacao_url?: string | null
          id?: string
          link_url?: string | null
          publicado?: boolean
          tema: string
          updated_at?: string
        }
        Update: {
          convidada?: string | null
          created_at?: string
          data?: string
          gravacao_url?: string | null
          id?: string
          link_url?: string | null
          publicado?: boolean
          tema?: string
          updated_at?: string
        }
        Relationships: []
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
          consentimento_saude_em: string | null
          created_at: string
          id: string
          nome: string
          ocultar_ranking: boolean
          papel: Database["public"]["Enums"]["papel"]
          ultimo_acesso_em: string | null
          updated_at: string
        }
        Insert: {
          acesso_fim_em?: string | null
          acesso_inicio_em?: string | null
          apelido?: string | null
          consentimento_saude_em?: string | null
          created_at?: string
          id: string
          nome?: string
          ocultar_ranking?: boolean
          papel?: Database["public"]["Enums"]["papel"]
          ultimo_acesso_em?: string | null
          updated_at?: string
        }
        Update: {
          acesso_fim_em?: string | null
          acesso_inicio_em?: string | null
          apelido?: string | null
          consentimento_saude_em?: string | null
          created_at?: string
          id?: string
          nome?: string
          ocultar_ranking?: boolean
          papel?: Database["public"]["Enums"]["papel"]
          ultimo_acesso_em?: string | null
          updated_at?: string
        }
        Relationships: []
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
          porcoes: number
          preparo: string
          publicado: boolean
          tags: string[]
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
          porcoes?: number
          preparo?: string
          publicado?: boolean
          tags?: string[]
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
          porcoes?: number
          preparo?: string
          publicado?: boolean
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
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
      temas: {
        Row: {
          created_at: string
          descricao: string
          id: string
          ordem: number
          publicado: boolean
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string
          id?: string
          ordem?: number
          publicado?: boolean
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          ordem?: number
          publicado?: boolean
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
      dia_de_acesso: { Args: never; Returns: number }
      dias_cumpridos: {
        Args: { p_desafio: string; p_perfil: string }
        Returns: number
      }
      duplicar_alimento: { Args: { p_id: string }; Returns: string }
      eh_admin: { Args: never; Returns: boolean }
      hoje_brasilia: { Args: never; Returns: string }
      minha_trilha: {
        Args: never
        Returns: {
          concluida: boolean
          dia_liberacao: number
          duracao_minutos: number
          etapa_id: string
          etapa_ordem: number
          etapa_titulo: string
          id: string
          liberada: boolean
          ordem: number
          profissional: string
          tema_id: string
          tema_ordem: number
          tema_titulo: string
          titulo: string
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
      painel_desafios: {
        Args: never
        Returns: {
          concluintes: number
          id: string
          participantes: number
        }[]
      }
      registrar_acesso: { Args: never; Returns: undefined }
      salvar_alimento: {
        Args: { p_alimento: Json; p_medidas: Json }
        Returns: string
      }
      salvar_receita_itens: {
        Args: { p_itens: Json; p_receita: string }
        Returns: undefined
      }
      tem_acesso_ativo: { Args: never; Returns: boolean }
      texto_busca: { Args: { valor: string }; Returns: string }
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
