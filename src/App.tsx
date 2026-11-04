import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Layout } from '@/components/Layout'
import Inicio from '@/pages/Inicio'
import Produto from '@/pages/Produto'
import Politicas from '@/pages/Politicas'
import Admin from '@/pages/Admin'

function NaoEncontrada() {
  return (
    <Layout>
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-7xl font-black text-sky-200">404</p>
        <h1 className="mt-2 text-3xl font-black text-sky-900">Esta página mergulhou fundo</h1>
        <p className="mt-3 text-sky-900/70">O endereço não existe ou foi movido. Volte para a vitrine e continue navegando.</p>
        <a href="/" className="mt-8 inline-flex h-11 items-center rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-8 font-black text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.03]">
          Voltar ao início
        </a>
      </section>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors closeButton toastOptions={{ className: 'rounded-2xl font-sans' }} />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/produto" element={<Produto />} />
        <Route path="/produto/:slug" element={<Produto />} />
        <Route path="/politicas" element={<Politicas />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Routes>
    </BrowserRouter>
  )
}
