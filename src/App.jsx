// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { Toaster } from 'react-hot-toast'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BooksList from './pages/BooksList'
import BookDetail from './pages/BookDetail'
import CreateBook from './pages/CreateBook'
import EditBook from './pages/EditBook'
import NotFound from './pages/NotFound'

// HOCs
import WithAuth from './hocs/WithAuth'
import WithRole from './hocs/WithRole'

const App = () => {
  



  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/" element={<WithAuth><Dashboard /></WithAuth>} />
        <Route path="/books" element={<WithAuth><BooksList /></WithAuth>} />
        <Route path="/books/:id" element={<WithAuth><BookDetail /></WithAuth>} />
        
        {/* Admin-only routes */}
        <Route 
          path="/books/create" 
          element={
            <WithAuth>
              <WithRole roles={['ADMIN']}>
                <CreateBook />
              </WithRole>
            </WithAuth>
          } 
        />
        <Route 
          path="/books/:id/edit" 
          element={
            <WithAuth>
              <WithRole roles={['ADMIN']}>
                <EditBook />
              </WithRole>
            </WithAuth>
          } 
        />
        
        {/* Fallback routes */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  )
}

export default App