import React, { useState } from 'react'
import { TextField, SelectField } from '../components/FormField'
import { GaugeBar, MetricCard, Badge, ErrorAlert, SectionLabel, SubmitButton, ResetButton } from '../components/ui'
import { usePrediction } from '../hooks/usePrediction'
import { predictRenewal } from '../services/api'
import type { RenewalRequest } from '../types'
import { PageHeader } from '../components/PageHeader'

const COLOR = '#185FA5'

const defaultForm: RenewalRequest = {
  policy_id: 'POL-2024-001', customer_age: 42, policy_age_years: 3.5,
  premium_amount: 15000, num_claims_history: 1, payment_delay_days: 5,
  coverage_type: 'comprehensive', last_interaction_days: 30,
  sum_insured: 500000, channel: 'agent',
}

export const RenewalPage: React.FC = () => {
  const [form, setForm] = useState<RenewalRequest>(defaultForm)
  const { result, loading, error, predict, reset } = usePrediction(predictRenewal)

  const upd = <K extends keyof RenewalRequest>(key: K, raw: string) => {
    const numKeys: (keyof RenewalRequest)[] = ['customer_age','policy_age_years','premium_amount','num_claims_history','payment_delay_days','last_interaction_days','sum_insured']
    setForm(prev => ({ ...prev, [key]: numKeys.includes(key) ? Number(raw) : raw }))
  }

  const riskVariant = (r: string) => r === 'low' ? 'success' : r === 'medium' ? 'warning' : 'danger'

  return (
    <div>
    <PageHeader title="Renewal Prediction" description="ใช้ทำนายว่า “ลูกค้าจะต่ออายุไหม”." color={COLOR} icon="🔄" />
    <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '680px', gap: 32, alignItems: 'start' }}>
      {/* Form */}
      <div>
        <SectionLabel>Policy information</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
          <TextField label="Policy ID"                value={form.policy_id}            onChange={v => upd('policy_id', v)} />
          <TextField label="Customer age"             value={form.customer_age}         onChange={v => upd('customer_age', v)}         type="number" min={18} max={100} />
          <TextField label="Policy age (years)"       value={form.policy_age_years}     onChange={v => upd('policy_age_years', v)}     type="number" step={0.1} min={0} />
          <TextField label="Premium amount (฿)"       value={form.premium_amount}       onChange={v => upd('premium_amount', v)}       type="number" min={0} />
          <TextField label="Claims history"           value={form.num_claims_history}   onChange={v => upd('num_claims_history', v)}   type="number" min={0} />
          <TextField label="Payment delay (days)"     value={form.payment_delay_days}   onChange={v => upd('payment_delay_days', v)}   type="number" min={0} />
          <SelectField label="Coverage type"          value={form.coverage_type}        onChange={v => upd('coverage_type', v)}
            options={[{value:'basic',label:'Basic'},{value:'comprehensive',label:'Comprehensive'},{value:'premium',label:'Premium'}]} />
          <TextField label="Last interaction (days)"  value={form.last_interaction_days} onChange={v => upd('last_interaction_days', v)} type="number" min={0} />
          <TextField label="Sum insured (฿)"          value={form.sum_insured}          onChange={v => upd('sum_insured', v)}          type="number" min={0} />
          <SelectField label="Channel"                value={form.channel}              onChange={v => upd('channel', v)}
            options={[{value:'agent',label:'Agent'},{value:'online',label:'Online'},{value:'broker',label:'Broker'}]} />
        </div>
        <div style={{ marginTop: 20 }}>
          <SubmitButton loading={loading} color={COLOR} label="Predict renewal" onClick={() => predict(form)} />
          <ResetButton onClick={() => { setForm(defaultForm); reset() }} />
        </div>
        {error && <ErrorAlert message={error} />}
      </div>

      {/* Result */}
      {result && (
        <div>
          <SectionLabel>Prediction result</SectionLabel>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <MetricCard
                label="Renewal probability"
                value={`${(result.renewal_probability * 100).toFixed(1)}%`}
                accent={COLOR}
                sub={<GaugeBar value={result.renewal_probability} color={COLOR} />}
              />
              <MetricCard
                label="Prediction"
                value={result.will_renew ? '✓ Will renew' : '✗ Will not renew'}
                accent={result.will_renew ? '#15803d' : '#b91c1c'}
                sub={<Badge label={`Risk: ${result.risk_level}`} variant={riskVariant(result.risk_level) as 'success'|'warning'|'danger'} />}
              />
            </div>
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Recommended action</p>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>{result.recommended_action}</p>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}
