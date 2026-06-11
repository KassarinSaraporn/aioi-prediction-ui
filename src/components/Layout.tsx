import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

interface NavItem { to: string; label: string; icon: string; color: string }

const navItems: NavItem[] = [
  { to: '/renewal',   label: 'Renewal',    icon: '🔄', color: '#185FA5' },
  { to: '/claim',     label: 'Claim',      icon: '📋', color: '#0F6E56' },
  { to: '/crosssell', label: 'Cross-Sell', icon: '🎯', color: '#534AB7' },
  { to: '/fraud',     label: 'Fraud',      icon: '🔍', color: '#993C1D' },
]

export const Layout: React.FC = () => (
  <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6', fontFamily: "'Inter', system-ui, sans-serif" }}>
    {/* Sidebar */}
    <aside style={{
      width: 220, background: '#fff', borderRight: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      position: 'sticky', top: 0, height: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 16 }}>🛡</span>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>Insurance ML</p>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Prediction Suite</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 12px', flex: 1 }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', margin: '0 0 8px' }}>
          Modules
        </p>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', borderRadius: 8, marginBottom: 2,
              textDecoration: 'none', fontSize: 13, fontWeight: 500,
              transition: 'all 0.15s',
              background: isActive ? item.color + '14' : 'transparent',
              color: isActive ? item.color : '#6b7280',
              borderLeft: isActive ? `3px solid ${item.color}` : '3px solid transparent',
            })}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #f3f4f6' }}>
        <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>API: localhost:8000</p>
      </div>
    </aside>

    {/* Main content */}
    <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
      <Outlet />
    </main>
  </div>
)
