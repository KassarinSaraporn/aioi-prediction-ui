import React from 'react'

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', fontSize: 13,
  border: '1px solid #d1d5db', borderRadius: 7, outline: 'none',
  background: '#fff', color: '#111827', boxSizing: 'border-box',
  fontFamily: 'inherit',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 500,
  color: '#374151', marginBottom: 4,
}

interface FieldProps {
  label: string
  value: string | number
  onChange: (v: string) => void
  type?: 'text' | 'number'
  min?: number
  max?: number
  step?: number
}
export const TextField: React.FC<FieldProps> = ({ label, value, onChange, type = 'text', min, max, step }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      type={type} value={value} min={min} max={max} step={step}
      onChange={e => onChange(e.target.value)}
      style={fieldStyle}
      onFocus={e => (e.target.style.borderColor = '#6366f1')}
      onBlur={e => (e.target.style.borderColor = '#d1d5db')}
    />
  </div>
)

interface SelectFieldProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}
export const SelectField: React.FC<SelectFieldProps> = ({ label, value, options, onChange }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} style={{ ...fieldStyle, cursor: 'pointer' }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
)

interface MultiCheckProps {
  label: string
  options: string[]
  selected: string[]
  color: string
  onChange: (selected: string[]) => void
}
export const MultiCheckField: React.FC<MultiCheckProps> = ({ label, options, selected, color, onChange }) => (
  <div style={{ gridColumn: '1 / -1' }}>
    <label style={labelStyle}>{label}</label>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 2 }}>
      {options.map(opt => {
        const checked = selected.includes(opt)
        return (
          <button
            key={opt}
            onClick={() => onChange(checked ? selected.filter(p => p !== opt) : [...selected, opt])}
            style={{
              padding: '4px 14px', borderRadius: 99, fontSize: 12, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s',
              border: `1.5px solid ${checked ? color : '#d1d5db'}`,
              background: checked ? color + '18' : '#fff',
              color: checked ? color : '#6b7280',
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  </div>
)
