import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Catalogo from './pages/Catalogo.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Catalogo />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
