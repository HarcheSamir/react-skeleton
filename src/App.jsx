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
  const fetchUser = useAuthStore(state => state.fetchUser)
  const isLoading = useAuthStore(state => state.isLoading)

  useEffect(() => {
    console.log("VITE_API_URL value:", import.meta.env.VITE_API_URL);
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser()
    }
  }, [fetchUser])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

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