import { PageHeader } from '../components/PageHeader'
import React, { useState } from 'react'
import { TextField, SelectField } from '../components/FormField'
import { GaugeBar, MetricCard, ErrorAlert, SectionLabel, SubmitButton, ResetButton, Badge } from '../components/ui'
import { usePrediction } from '../hooks/usePrediction'
import { predictClaim } from '../services/api'
import type { ClaimRequest } from '../types'

const COLOR = '#0F6E56'

const defaultForm: ClaimRequest = {
  policy_id: 'POL-2024-002', insured_age: 35, vehicle_age_years: 4,
  vehicle_type: 'sedan', coverage_type: 'comprehensive', sum_insured: 800000,
  driver_experience_years: 10, province: 'Bangkok',
  num_previous_claims: 0, annual_mileage_km: 20000,
}

export const ClaimPage: React.FC = () => {
  const [form, setForm] = useState<ClaimRequest>(defaultForm)
  const { result, loading, error, predict, reset } = usePrediction(predictClaim)

  const upd = <K extends keyof ClaimRequest>(key: K, raw: string) => {
    const numKeys: (keyof ClaimRequest)[] = ['insured_age','vehicle_age_years','sum_insured','driver_experience_years','num_previous_claims','annual_mileage_km']
    setForm(prev => ({ ...prev, [key]: numKeys.includes(key) ? Number(raw) : raw }))
  }

  const catVariant = (c: string): 'success'|'warning'|'danger' =>
    c === 'low' ? 'success' : c === 'moderate' ? 'warning' : 'danger'

  const fmt = (n: number) => new Intl.NumberFormat('th-TH').format(Math.round(n))

  return (
    <div>
    <PageHeader title="Claim Prediction" description="ลูกค้าคนนี้มีโอกาสเคลมไหม." color={COLOR} icon="📋" />
    <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '680px', gap: 32, alignItems: 'start' }}>
      <div>
        <SectionLabel>Vehicle & policy information</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
          <TextField label="Policy ID"                  value={form.policy_id}               onChange={v => upd('policy_id', v)} />
          <TextField label="Insured age"                value={form.insured_age}              onChange={v => upd('insured_age', v)}              type="number" min={18} max={100} />
          <TextField label="Vehicle age (years)"        value={form.vehicle_age_years}        onChange={v => upd('vehicle_age_years', v)}        type="number" step={0.1} min={0} />
          <SelectField label="Vehicle type"             value={form.vehicle_type}             onChange={v => upd('vehicle_type', v)}
            options={[{value:'sedan',label:'Sedan'},{value:'suv',label:'SUV'},{value:'truck',label:'Truck'},{value:'motorcycle',label:'Motorcycle'}]} />
          <SelectField label="Coverage type"            value={form.coverage_type}            onChange={v => upd('coverage_type', v)}
            options={[{value:'basic',label:'Basic'},{value:'comprehensive',label:'Comprehensive'},{value:'premium',label:'Premium'}]} />
          <TextField label="Sum insured (฿)"            value={form.sum_insured}              onChange={v => upd('sum_insured', v)}              type="number" min={0} />
          <TextField label="Driver experience (years)"  value={form.driver_experience_years}  onChange={v => upd('driver_experience_years', v)}  type="number" min={0} />
          <TextField label="Province"                   value={form.province}                 onChange={v => upd('province', v)} />
          <TextField label="Previous claims"            value={form.num_previous_claims}      onChange={v => upd('num_previous_claims', v)}      type="number" min={0} />
          <TextField label="Annual mileage (km)"        value={form.annual_mileage_km}        onChange={v => upd('annual_mileage_km', v)}        type="number" min={0} />
        </div>
        <div style={{ marginTop: 20 }}>
          <SubmitButton loading={loading} color={COLOR} label="Predict claim" onClick={() => predict(form)} />
          <ResetButton onClick={() => { setForm(defaultForm); reset() }} />
        </div>
        {error && <ErrorAlert message={error} />}
      </div>

      {result && (
        <div>
          <SectionLabel>Prediction result</SectionLabel>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <MetricCard
                label="Claim probability"
                value={`${(result.claim_probability * 100).toFixed(1)}%`}
                accent={COLOR}
                sub={<GaugeBar value={result.claim_probability} color={COLOR} />}
              />
              <MetricCard
                label="Risk category"
                value={result.risk_category.replace('_', ' ')}
                accent={COLOR}
                sub={<Badge label={`Score: ${result.risk_score.toFixed(3)}`} variant={catVariant(result.risk_category)} />}
              />
            </div>
            <MetricCard
              label="Expected claim amount"
              value={`฿${fmt(result.expected_claim_amount)}`}
              accent={COLOR}
            />
          </div>
        </div>
      )}
    </div>
    </div>
  )
}
