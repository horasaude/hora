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
      aulas: {
        Row: {
          created_at: string
          descricao: string
          dia_liberacao: number
          etapa_id: string
          id: string
          material_url: string | null
          ordem: number
          publicado: boolean
          titulo: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          descricao?: string
          dia_liberacao: number
          etapa_id: string
          id?: string
          material_url?: string | null
          ordem?: number
          publicado?: boolean
          titulo: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          descricao?: string
          dia_liberacao?: number
          etapa_id?: string
          id?: string
          material_url?: string | null
          ordem?: number
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
      dia_de_acesso: { Args: never; Returns: number }
      eh_admin: { Args: never; Returns: boolean }
      hoje_brasilia: { Args: never; Returns: string }
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
      tem_acesso_ativo: { Args: never; Returns: boolean }
    }
    Enums: {
      papel: "aluna" | "admin"
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
    },
  },
} as const
