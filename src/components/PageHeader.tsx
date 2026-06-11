import React from 'react'

interface PageHeaderProps {
  title: string
  description: string
  color: string
  icon: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, color, icon }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
        {icon}
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h1>
    </div>
    <p style={{ fontSize: 13, color: '#6b7280', margin: 0, paddingLeft: 50 }}>{description}</p>
    <div style={{ height: 1, background: '#e5e7eb', marginTop: 20 }} />
  </div>
)
