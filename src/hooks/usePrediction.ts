import { useState } from 'react'

export function usePrediction<TReq, TRes>(
  apiFn: (data: TReq) => Promise<TRes>
) {
  const [result, setResult] = useState<TRes | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  const predict = async (data: TReq) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFn(data)
      setResult(res)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string }; }; message?: string })
        ?.response?.data?.detail ?? (e as Error).message ?? 'Unknown error'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setResult(null); setError(null) }

  return { result, loading, error, predict, reset }
}
