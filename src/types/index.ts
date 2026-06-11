// ─── Renewal ───────────────────────────────────────────────
export interface RenewalRequest {
  policy_id: string
  customer_age: number
  policy_age_years: number
  premium_amount: number
  num_claims_history: number
  payment_delay_days: number
  coverage_type: 'basic' | 'comprehensive' | 'premium'
  last_interaction_days: number
  sum_insured: number
  channel: 'agent' | 'online' | 'broker'
}
export interface RenewalResponse {
  policy_id: string
  renewal_probability: number
  will_renew: boolean
  risk_level: 'low' | 'medium' | 'high'
  recommended_action: string
}

// ─── Claim ─────────────────────────────────────────────────
export interface ClaimRequest {
  policy_id: string
  insured_age: number
  vehicle_age_years: number
  vehicle_type: 'sedan' | 'suv' | 'truck' | 'motorcycle'
  coverage_type: 'basic' | 'comprehensive' | 'premium'
  sum_insured: number
  driver_experience_years: number
  province: string
  num_previous_claims: number
  annual_mileage_km: number
}
export interface ClaimResponse {
  policy_id: string
  claim_probability: number
  expected_claim_amount: number
  risk_score: number
  risk_category: 'low' | 'moderate' | 'high' | 'very_high'
}

// ─── Cross-Sell ─────────────────────────────────────────────
export interface CrossSellRequest {
  customer_id: string
  age: number
  gender: 'M' | 'F'
  marital_status: 'single' | 'married' | 'divorced' | 'widowed'
  num_existing_policies: number
  existing_products: string[]
  annual_income: number
  tenure_years: number
  last_purchase_days: number
  has_dependents: boolean
}
export interface CrossSellResponse {
  customer_id: string
  recommended_products: string[]
  product_probabilities: Record<string, number>
  top_recommendation: string
  confidence_score: number
}

// ─── Fraud ──────────────────────────────────────────────────
export interface FraudRequest {
  claim_id: string
  policy_id: string
  claim_amount: number
  incident_type: 'collision' | 'theft' | 'fire' | 'natural_disaster' | 'other'
  incident_hour: number
  days_to_report: number
  num_witnesses: number
  police_report: boolean
  num_previous_claims: number
  claim_to_premium_ratio: number
  repair_shop_type: 'authorized' | 'non_authorized'
}
export interface FraudResponse {
  claim_id: string
  fraud_probability: number
  is_suspicious: boolean
  fraud_indicators: string[]
  investigation_priority: 'routine' | 'review' | 'urgent' | 'hold'
}
