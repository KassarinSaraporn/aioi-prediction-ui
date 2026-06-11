import React from 'react'

// ── Gauge bar ────────────────────────────────────────────────
interface GaugeProps { value: number; color: string; height?: number }
export const GaugeBar: React.FC<GaugeProps> = ({ value, color, height = 7 }) => (
  <div style={{ background: '#e5e7eb', borderRadius: 99, height, overflow: 'hidden', marginTop: 6 }}>
    <div style={{
      width: `${(value * 100).toFixed(1)}%`,
      background: color, height: '100%', borderRadius: 99,
      transition: 'width 0.6s ease',
    }} />
  </div>
)

// ── Metric card ──────────────────────────────────────────────
interface MetricProps { label: string; value: React.ReactNode; sub?: React.ReactNode; accent?: string }
export const MetricCard: React.FC<MetricProps> = ({ label, value, sub, accent }) => (
  <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 18px' }}>
    <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>{label}</p>
    <p style={{ fontSize: 26, fontWeight: 600, color: accent ?? '#111827', margin: '0 0 2px', lineHeight: 1.2 }}>{value}</p>
    {sub && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{sub}</div>}
  </div>
)

// ── Badge ────────────────────────────────────────────────────
type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
const badgeStyles: Record<BadgeVariant, { bg: string; color: string }> = {
  success: { bg: '#dcfce7', color: '#15803d' },
  warning: { bg: '#fef9c3', color: '#a16207' },
  danger:  { bg: '#fee2e2', color: '#b91c1c' },
  info:    { bg: '#dbeafe', color: '#1d4ed8' },
  neutral: { bg: '#f3f4f6', color: '#374151' },
}
interface BadgeProps { label: string; variant: BadgeVariant }
export const Badge: React.FC<BadgeProps> = ({ label, variant }) => {
  const s = badgeStyles[variant]
  return (
    <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500, background: s.bg, color: s.color }}>
      {label}
    </span>
  )
}

// ── Error alert ──────────────────────────────────────────────
export const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 8, background: '#fee2e2', color: '#b91c1c', fontSize: 13, border: '1px solid #fca5a5' }}>
    <strong>Error:</strong> {message}
  </div>
)

// ── Section heading ──────────────────────────────────────────
export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>{children}</p>
)

// ── Submit button ────────────────────────────────────────────
interface SubmitBtnProps { loading: boolean; color: string; label: string; onClick: () => void }
export const SubmitButton: React.FC<SubmitBtnProps> = ({ loading, color, label, onClick }) => (
  <button onClick={onClick} disabled={loading} style={{
    width: '100%', padding: '11px 0', borderRadius: 8, border: 'none',
    background: loading ? '#9ca3af' : color, color: '#fff',
    fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
    letterSpacing: '0.02em', transition: 'background 0.2s',
  }}>
    {loading ? 'Predicting…' : label}
  </button>
)

// ── Reset button ─────────────────────────────────────────────
export const ResetButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} style={{
    width: '100%', padding: '10px 0', borderRadius: 8,
    border: '1px solid #e5e7eb', background: '#fff', color: '#374151',
    fontSize: 13, cursor: 'pointer', marginTop: 8,
  }}>
    Reset
  </button>
)
