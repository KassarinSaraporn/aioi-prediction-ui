import axios from 'axios'
import type {
  RenewalRequest, RenewalResponse,
  ClaimRequest, ClaimResponse,
  CrossSellRequest, CrossSellResponse,
  FraudRequest, FraudResponse,
} from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://aioi-prediction-api-production.up.railway.app',
  headers: { 'Content-Type': 'application/json' },
})

export const predictRenewal  = (data: RenewalRequest)   => api.post<RenewalResponse>('/renewal/predict', data).then(r => r.data)
export const predictClaim    = (data: ClaimRequest)     => api.post<ClaimResponse>('/claim/predict', data).then(r => r.data)
export const predictCrossSell= (data: CrossSellRequest) => api.post<CrossSellResponse>('/crosssell/predict', data).then(r => r.data)
export const detectFraud     = (data: FraudRequest)     => api.post<FraudResponse>('/fraud/predict', data).then(r => r.data)
