import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage  from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import BlogPage  from './pages/BlogPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"      element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/blog"  element={<BlogPage />} />
      </Routes>
    </BrowserRouter>
  )
}
