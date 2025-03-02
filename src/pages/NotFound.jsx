// src/pages/NotFound.jsx
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const NotFound = () => {
  const { isAuthenticated } = useAuthStore()
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-600 text-center mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <Link 
        to={isAuthenticated ? '/' : '/login'} 
        className="btn-primary"
      >
        {isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
      </Link>
    </div>
  )
}

export default NotFound