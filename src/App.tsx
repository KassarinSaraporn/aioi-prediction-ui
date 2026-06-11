import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { RenewalPage }   from './pages/RenewalPage'
import { ClaimPage }     from './pages/ClaimPage'
import { CrossSellPage } from './pages/CrossSellPage'
import { FraudPage }     from './pages/FraudPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/renewal" replace />} />
          <Route path="renewal"   element={<RenewalPage />} />
          <Route path="claim"     element={<ClaimPage />} />
          <Route path="crosssell" element={<CrossSellPage />} />
          <Route path="fraud"     element={<FraudPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
