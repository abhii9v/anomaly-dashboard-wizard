export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ad_spend_metrics: {
        Row: {
          anomaly: boolean | null
          campaign_id: number | null
          clicks: number | null
          created_at: string | null
          forecast_spend: number | null
          id: number
          impressions: number | null
          spend: number
          timestamp: string
          unique_users: number | null
          variance_percent: number | null
        }
        Insert: {
          anomaly?: boolean | null
          campaign_id?: number | null
          clicks?: number | null
          created_at?: string | null
          forecast_spend?: number | null
          id?: number
          impressions?: number | null
          spend: number
          timestamp: string
          unique_users?: number | null
          variance_percent?: number | null
        }
        Update: {
          anomaly?: boolean | null
          campaign_id?: number | null
          clicks?: number | null
          created_at?: string | null
          forecast_spend?: number | null
          id?: number
          impressions?: number | null
          spend?: number
          timestamp?: string
          unique_users?: number | null
          variance_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_spend_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      affected_systems: {
        Row: {
          id: number
          incident_id: number | null
          system_name: string
        }
        Insert: {
          id?: number
          incident_id?: number | null
          system_name: string
        }
        Update: {
          id?: number
          incident_id?: number | null
          system_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "affected_systems_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_levels: {
        Row: {
          created_at: string | null
          description: string | null
          event_id: number | null
          id: number
          level: string
          threshold: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_id?: number | null
          id?: number
          level: string
          threshold: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_id?: number | null
          id?: number
          level?: string
          threshold?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_levels_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "forecast_events"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_users: {
        Row: {
          created_at: string | null
          id: number
          level: string
          sla: string
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          level: string
          sla: string
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          level?: string
          sla?: string
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: number
          created_at: string | null
          end_date: string | null
          id: number
          name: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          budget: number
          created_at?: string | null
          end_date?: string | null
          id?: number
          name: string
          start_date: string
          status: string
          updated_at?: string | null
        }
        Update: {
          budget?: number
          created_at?: string | null
          end_date?: string | null
          id?: number
          name?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_analytics: {
        Row: {
          anomalies_detected: number | null
          created_at: string | null
          date: string
          forecast_accuracy: number | null
          fraud_prevention_amount: number | null
          id: number
          total_ad_spend: number
          total_clicks: number
          total_impressions: number
          total_unique_users: number
        }
        Insert: {
          anomalies_detected?: number | null
          created_at?: string | null
          date: string
          forecast_accuracy?: number | null
          fraud_prevention_amount?: number | null
          id?: number
          total_ad_spend: number
          total_clicks: number
          total_impressions: number
          total_unique_users: number
        }
        Update: {
          anomalies_detected?: number | null
          created_at?: string | null
          date?: string
          forecast_accuracy?: number | null
          fraud_prevention_amount?: number | null
          id?: number
          total_ad_spend?: number
          total_clicks?: number
          total_impressions?: number
          total_unique_users?: number
        }
        Relationships: []
      }
      escalation_logs: {
        Row: {
          action: string
          created_at: string | null
          id: number
          incident_id: number | null
          level: string
          logged_at: string
          user_id: number | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: number
          incident_id?: number | null
          level: string
          logged_at: string
          user_id?: number | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: number
          incident_id?: number | null
          level?: string
          logged_at?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "escalation_logs_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escalation_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      forecast_events: {
        Row: {
          ad_spend_change: string | null
          created_at: string | null
          date: string
          expected_ad_spend: number
          expected_revenue: number
          expected_traffic: number
          historical_ad_spend: number | null
          historical_revenue: number | null
          historical_traffic: number | null
          id: number
          name: string
          priority: string
          revenue_change: string | null
          traffic_change: string | null
          updated_at: string | null
        }
        Insert: {
          ad_spend_change?: string | null
          created_at?: string | null
          date: string
          expected_ad_spend: number
          expected_revenue: number
          expected_traffic: number
          historical_ad_spend?: number | null
          historical_revenue?: number | null
          historical_traffic?: number | null
          id?: number
          name: string
          priority: string
          revenue_change?: string | null
          traffic_change?: string | null
          updated_at?: string | null
        }
        Update: {
          ad_spend_change?: string | null
          created_at?: string | null
          date?: string
          expected_ad_spend?: number
          expected_revenue?: number
          expected_traffic?: number
          historical_ad_spend?: number | null
          historical_revenue?: number | null
          historical_traffic?: number | null
          id?: number
          name?: string
          priority?: string
          revenue_change?: string | null
          traffic_change?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hourly_forecasts: {
        Row: {
          ad_spend: number
          created_at: string | null
          event_id: number | null
          hour: string
          id: number
          revenue: number
          traffic: number
          updated_at: string | null
        }
        Insert: {
          ad_spend: number
          created_at?: string | null
          event_id?: number | null
          hour: string
          id?: number
          revenue: number
          traffic: number
          updated_at?: string | null
        }
        Update: {
          ad_spend?: number
          created_at?: string | null
          event_id?: number | null
          hour?: string
          id?: number
          revenue?: number
          traffic?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hourly_forecasts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "forecast_events"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          affected_users: number | null
          created_at: string | null
          description: string
          detected_at: string
          duration: string | null
          financial_loss: number | null
          id: number
          resolved_at: string | null
          severity: string
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          affected_users?: number | null
          created_at?: string | null
          description: string
          detected_at: string
          duration?: string | null
          financial_loss?: number | null
          id?: number
          resolved_at?: string | null
          severity: string
          status: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          affected_users?: number | null
          created_at?: string | null
          description?: string
          detected_at?: string
          duration?: string | null
          financial_loss?: number | null
          id?: number
          resolved_at?: string | null
          severity?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      recent_anomalies: {
        Row: {
          campaign: string
          created_at: string | null
          expected: number
          id: number
          severity: string
          time: string
          value: number
        }
        Insert: {
          campaign: string
          created_at?: string | null
          expected: number
          id?: number
          severity: string
          time: string
          value: number
        }
        Update: {
          campaign?: string
          created_at?: string | null
          expected?: number
          id?: number
          severity?: string
          time?: string
          value?: number
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          created_at: string | null
          id: number
          incident_id: number | null
          priority: number | null
          recommendation: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          incident_id?: number | null
          priority?: number | null
          recommendation: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          incident_id?: number | null
          priority?: number | null
          recommendation?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      recovery_timeline: {
        Row: {
          created_at: string | null
          id: number
          incident_id: number | null
          progress: number
          stage: string
          time: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          incident_id?: number | null
          progress: number
          stage: string
          time: string
        }
        Update: {
          created_at?: string | null
          id?: number
          incident_id?: number | null
          progress?: number
          stage?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "recovery_timeline_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          created_at: string | null
          current: number
          event_id: number | null
          id: number
          name: string
          required: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current: number
          event_id?: number | null
          id?: number
          name: string
          required: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current?: number
          event_id?: number | null
          id?: number
          name?: string
          required?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "forecast_events"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          id: number
          setting_key: string
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          contact: string | null
          created_at: string | null
          email: string
          id: number
          level: string
          name: string
          updated_at: string | null
        }
        Insert: {
          contact?: string | null
          created_at?: string | null
          email: string
          id?: number
          level: string
          name: string
          updated_at?: string | null
        }
        Update: {
          contact?: string | null
          created_at?: string | null
          email?: string
          id?: number
          level?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
