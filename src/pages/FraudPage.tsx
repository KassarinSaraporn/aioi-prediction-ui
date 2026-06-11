import { PageHeader } from '../components/PageHeader'
import React, { useState } from 'react'
import { TextField, SelectField } from '../components/FormField'
import { GaugeBar, MetricCard, ErrorAlert, SectionLabel, SubmitButton, ResetButton, Badge } from '../components/ui'
import { usePrediction } from '../hooks/usePrediction'
import { detectFraud } from '../services/api'
import type { FraudRequest } from '../types'

const COLOR = '#993C1D'

const defaultForm: FraudRequest = {
  claim_id: 'CLM-2024-005', policy_id: 'POL-2024-002',
  claim_amount: 250000, incident_type: 'collision', incident_hour: 2,
  days_to_report: 14, num_witnesses: 0, police_report: false,
  num_previous_claims: 3, claim_to_premium_ratio: 5.2,
  repair_shop_type: 'non_authorized',
}

const priorityVariant = (p: string): 'success'|'warning'|'danger' =>
  p === 'routine' ? 'success' : p === 'review' ? 'warning' : 'danger'

const priorityLabel: Record<string, string> = {
  routine: 'Routine', review: 'Review', urgent: 'Urgent', hold: 'Hold',
}

export const FraudPage: React.FC = () => {
  const [form, setForm] = useState<FraudRequest>(defaultForm)
  const { result, loading, error, predict, reset } = usePrediction(detectFraud)

  const upd = <K extends keyof FraudRequest>(key: K, raw: string) => {
    const numKeys: (keyof FraudRequest)[] = ['claim_amount','incident_hour','days_to_report','num_witnesses','num_previous_claims','claim_to_premium_ratio']
    if (key === 'police_report') {
      setForm(prev => ({ ...prev, police_report: raw === 'true' }))
    } else {
      setForm(prev => ({ ...prev, [key]: numKeys.includes(key) ? Number(raw) : raw }))
    }
  }

  return (
    <div>
    <PageHeader title="Fraud Detection" description="ใช้ตรวจจับเคลมผิดปกติ." color={COLOR} icon="🔍" />
    <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '680px', gap: 32, alignItems: 'start' }}>
      <div>
        <SectionLabel>Claim details</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
          <TextField label="Claim ID"                 value={form.claim_id}                onChange={v => upd('claim_id', v)} />
          <TextField label="Policy ID"                value={form.policy_id}               onChange={v => upd('policy_id', v)} />
          <TextField label="Claim amount (฿)"         value={form.claim_amount}            onChange={v => upd('claim_amount', v)}            type="number" min={0} />
          <SelectField label="Incident type"          value={form.incident_type}           onChange={v => upd('incident_type', v)}
            options={[{value:'collision',label:'Collision'},{value:'theft',label:'Theft'},{value:'fire',label:'Fire'},{value:'natural_disaster',label:'Natural disaster'},{value:'other',label:'Other'}]} />
          <TextField label="Incident hour (0–23)"     value={form.incident_hour}           onChange={v => upd('incident_hour', v)}           type="number" min={0} max={23} />
          <TextField label="Days to report"           value={form.days_to_report}          onChange={v => upd('days_to_report', v)}          type="number" min={0} />
          <TextField label="Witnesses"                value={form.num_witnesses}           onChange={v => upd('num_witnesses', v)}           type="number" min={0} />
          <SelectField label="Police report"          value={String(form.police_report)}   onChange={v => upd('police_report', v)}
            options={[{value:'true',label:'Yes'},{value:'false',label:'No'}]} />
          <TextField label="Previous claims"          value={form.num_previous_claims}     onChange={v => upd('num_previous_claims', v)}     type="number" min={0} />
          <TextField label="Claim / premium ratio"    value={form.claim_to_premium_ratio}  onChange={v => upd('claim_to_premium_ratio', v)}  type="number" step={0.1} min={0} />
          <SelectField label="Repair shop"            value={form.repair_shop_type}        onChange={v => upd('repair_shop_type', v)}
            options={[{value:'authorized',label:'Authorized'},{value:'non_authorized',label:'Non-authorized'}]} />
        </div>
        <div style={{ marginTop: 20 }}>
          <SubmitButton loading={loading} color={COLOR} label="Detect fraud" onClick={() => predict(form)} />
          <ResetButton onClick={() => { setForm(defaultForm); reset() }} />
        </div>
        {error && <ErrorAlert message={error} />}
      </div>

      {result && (
        <div>
          <SectionLabel>Detection result</SectionLabel>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <MetricCard
                label="Fraud probability"
                value={`${(result.fraud_probability * 100).toFixed(1)}%`}
                accent={result.is_suspicious ? '#b91c1c' : '#15803d'}
                sub={<GaugeBar value={result.fraud_probability} color={result.is_suspicious ? '#E24B4A' : '#1D9E75'} />}
              />
              <MetricCard
                label="Investigation priority"
                value={priorityLabel[result.investigation_priority]}
                accent={result.investigation_priority === 'routine' ? '#15803d' : '#b91c1c'}
                sub={
                  <Badge
                    label={result.is_suspicious ? '⚠ Suspicious' : '✓ Not suspicious'}
                    variant={priorityVariant(result.investigation_priority)}
                  />
                }
              />
            </div>

            {result.fraud_indicators.length > 0 && (
              <div style={{ background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: 10, padding: '14px 18px' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                  Fraud indicators ({result.fraud_indicators.length})
                </p>
                {result.fraud_indicators.map((ind, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 7, fontSize: 13, color: '#374151' }}>
                    <span style={{ color: '#b91c1c', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>●</span>
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  )
}
