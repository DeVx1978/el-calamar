import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// ============================================================
// ✅ VARIABLES DE ENTORNO — NUNCA HARDCODEAR KEYS
// ============================================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ============================================================
// ✅ CLIENTE BROWSER — Para componentes "use client"
// Uso: import { supabase } from '@/lib/supabase'
// ============================================================
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// ============================================================
// ✅ CLIENTE ADMIN — SOLO para route handlers del servidor (app/api/*)
// NUNCA importar este en componentes "use client"
// Requiere SUPABASE_SERVICE_ROLE_KEY en .env.local (sin prefijo NEXT_PUBLIC_)
// ============================================================
export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY no configurada en .env.local')
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// ============================================================
// ✅ TIPOS DE LA BASE DE DATOS — El Calamar del Mundial
// ============================================================
export type PlayerStatus = 'VIVO' | 'COMA' | 'ELIMINADO'
export type MatchStatus = 'PROXIMAMENTE' | 'EN_VIVO' | 'FINALIZADO' | 'CANCELADO'
export type TournamentStatus = 'BORRADOR' | 'ACTIVO' | 'CERRADO' | 'FINALIZADO'
export type TransactionType = 'RECHARGE' | 'REDEEM_PIN' | 'ENTRY_FEE' | 'PRIZE' | 'BONUS'
export type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type PinStatus = 'DISPONIBLE' | 'CANJEADO' | 'EXPIRADO'
export type UserRole = 'player' | 'admin' | 'distributor'

export interface Profile {
  id: string
  username: string
  full_name: string
  email: string
  phone: string
  country: string
  role: UserRole
  pitchx_balance: number
  lives: number
  status: PlayerStatus
  coma_until: string | null
  streak: number
  best_streak: number
  is_ghost: boolean
  ghost_tournament_id: string | null
  avatar_url: string | null
  player_code: string
  created_at: string
}

export interface Tournament {
  id: string
  name: string
  slug: string
  type: 'LEAGUE' | 'CUP' | 'SINGLE_MATCH' | 'FRIENDLY'
  status: TournamentStatus
  bg_image: string
  accent_color: string
  prize_base: number
  entry_cost: number
  difficulty_level: number
  ghost_count: number
  target_region: string | null
  total_matches: number
  current_match_number: number
  created_at: string
}

export interface Match {
  id: string
  tournament_id: string
  tournament_name: string
  home_team: string
  away_team: string
  home_flag: string
  away_flag: string
  match_date: string
  stadium: string
  city: string
  status: MatchStatus
  result: 'LOCAL' | 'EMPATE' | 'VISITANTE' | null
  home_score: number | null
  away_score: number | null
  difficulty_level: number
  match_number: number
  markets: Market[]
  created_at: string
}

export interface Market {
  id: string
  title: string
  options: MarketOption[]
  correct_option_id: string | null
}

export interface MarketOption {
  id: string
  text: string
  icon: '○' | '△' | '□' | '✕'
  odds: string
}

export interface Prediction {
  id: string
  user_id: string
  match_id: string
  tournament_id: string
  answers: Record<string, string>
  is_correct: boolean | null
  points_earned: number
  sealed_at: string
  evaluated_at: string | null
}

export interface Pin {
  id: string
  code: string
  value_px: number
  value_lives: number
  value_usd: number
  distributor_id: string | null
  redeemed_by: string | null
  redeemed_at: string | null
  status: PinStatus
  batch_id: string
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount_usd: number
  amount_px: number
  method: string
  reference: string | null
  status: TransactionStatus
  gateway_response: Record<string, unknown> | null
  created_at: string
}

export interface Sponsor {
  id: string
  name: string
  logo_url: string
  link_url: string
  tier: 'PLATINUM' | 'GOLD' | 'SILVER'
  target_countries: string[]
  active: boolean
  created_at: string
}