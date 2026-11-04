import { Route, Routes } from 'react-router-dom'
import { Painel } from '@/pages/admin/Painel'

export function Admin() {
  return (
    <Routes>
      <Route path="*" element={<Painel />} />
    </Routes>
  )
}
