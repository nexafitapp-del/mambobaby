import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Painel } from '@/pages/admin/Painel'
import { LoginAdmin } from '@/pages/admin/LoginAdmin'
import { sessaoSalva } from '@/lib/admin'

export default function Admin() {
  const [email, setEmail] = useState<string | null>(() => sessaoSalva()?.email ?? null)

  return (
    <Routes>
      <Route path="login" element={email ? <Navigate to="/admin" replace /> : <LoginAdmin onEntrar={setEmail} />} />
      <Route
        path="/*"
        element={email ? <Painel email={email} onSair={() => setEmail(null)} /> : <Navigate to="/admin/login" replace />}
      />
    </Routes>
  )
}

export function useSair() {
  const navigate = useNavigate()
  return () => navigate('/admin/login', { replace: true })
}
