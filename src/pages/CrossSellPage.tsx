import { PageHeader } from '../components/PageHeader'
import React, { useState } from 'react'
import { TextField, SelectField, MultiCheckField } from '../components/FormField'
import { GaugeBar, MetricCard, ErrorAlert, SectionLabel, SubmitButton, ResetButton } from '../components/ui'
import { usePrediction } from '../hooks/usePrediction'
import { predictCrossSell } from '../services/api'
import type { CrossSellRequest } from '../types'

const COLOR = '#534AB7'

const defaultForm: CrossSellRequest = {
  customer_id: 'CUST-10001', age: 38, gender: 'M',
  marital_status: 'married', num_existing_policies: 1,
  existing_products: ['motor'], annual_income: 720000,
  tenure_years: 2.5, last_purchase_days: 180, has_dependents: true,
}

const PRODUCTS = ['motor','health','life','pa','travel','home']

export const CrossSellPage: React.FC = () => {
  const [form, setForm] = useState<CrossSellRequest>(defaultForm)
  const { result, loading, error, predict, reset } = usePrediction(predictCrossSell)

  const upd = <K extends keyof CrossSellRequest>(key: K, raw: string) => {
    const numKeys: (keyof CrossSellRequest)[] = ['age','num_existing_policies','annual_income','tenure_years','last_purchase_days']
    if (key === 'has_dependents') {
      setForm(prev => ({ ...prev, has_dependents: raw === 'true' }))
    } else {
      setForm(prev => ({ ...prev, [key]: numKeys.includes(key) ? Number(raw) : raw }))
    }
  }

  return (
    <div>
    <PageHeader title="Cross-Sell Prediction" description="ใช้ทำนายว่า “ลูกค้าน่าจะซื้อประกันอะไรเพิ่ม”." color={COLOR} icon="🎯" />
    <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '680px', gap: 32, alignItems: 'start' }}>
      <div>
        <SectionLabel>Customer profile</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
          <TextField label="Customer ID"            value={form.customer_id}           onChange={v => upd('customer_id', v)} />
          <TextField label="Age"                    value={form.age}                   onChange={v => upd('age', v)}                   type="number" min={18} max={100} />
          <SelectField label="Gender"               value={form.gender}                onChange={v => upd('gender', v)}
            options={[{value:'M',label:'Male'},{value:'F',label:'Female'}]} />
          <SelectField label="Marital status"       value={form.marital_status}        onChange={v => upd('marital_status', v)}
            options={[{value:'single',label:'Single'},{value:'married',label:'Married'},{value:'divorced',label:'Divorced'},{value:'widowed',label:'Widowed'}]} />
          <TextField label="Existing policies"      value={form.num_existing_policies} onChange={v => upd('num_existing_policies', v)} type="number" min={0} />
          <TextField label="Annual income (฿)"      value={form.annual_income}         onChange={v => upd('annual_income', v)}         type="number" min={0} />
          <TextField label="Tenure (years)"         value={form.tenure_years}          onChange={v => upd('tenure_years', v)}          type="number" step={0.1} min={0} />
          <TextField label="Last purchase (days)"   value={form.last_purchase_days}    onChange={v => upd('last_purchase_days', v)}    type="number" min={0} />
          <SelectField label="Has dependents"       value={String(form.has_dependents)} onChange={v => upd('has_dependents', v)}
            options={[{value:'true',label:'Yes'},{value:'false',label:'No'}]} />
          <div />
          <MultiCheckField
            label="Existing products"
            options={PRODUCTS}
            selected={form.existing_products}
            color={COLOR}
            onChange={sel => setForm(prev => ({ ...prev, existing_products: sel }))}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <SubmitButton loading={loading} color={COLOR} label="Predict cross-sell" onClick={() => predict(form)} />
          <ResetButton onClick={() => { setForm(defaultForm); reset() }} />
        </div>
        {error && <ErrorAlert message={error} />}
      </div>

      {result && (
        <div>
          <SectionLabel>Prediction result</SectionLabel>
          <div style={{ display: 'grid', gap: 12 }}>
            <MetricCard
              label="Top recommendation"
              value={result.top_recommendation}
              accent={COLOR}
              sub={`Confidence: ${(result.confidence_score * 100).toFixed(1)}%`}
            />

            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Product probabilities</p>
              {Object.entries(result.product_probabilities)
                .sort((a, b) => b[1] - a[1])
                .map(([prod, prob]) => (
                  <div key={prod} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 2 }}>
                      <span style={{ textTransform: 'capitalize', color: '#374151' }}>{prod}</span>
                      <span style={{ fontWeight: 500, color: COLOR }}>{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <GaugeBar value={prob} color={COLOR} />
                  </div>
                ))}
            </div>

            {result.recommended_products.length > 0 && (
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Recommended products</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.recommended_products.map(p => (
                    <span key={p} style={{ padding: '4px 14px', borderRadius: 99, fontSize: 13, fontWeight: 500, background: COLOR + '18', color: COLOR }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  )
}
