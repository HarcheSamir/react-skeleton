// src/store/authStore.js
import { create } from 'zustand'
import { api } from '../services/api'
import toast from 'react-hot-toast'

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Login user
  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.post('/auth/login', credentials)
      const { token } = response.data
      
      // Store token in localStorage
      localStorage.setItem('token', token)
      
      // Fetch user data
      await get().fetchUser()
      
      toast.success('Logged in successfully')
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to login'
      set({ error: message, isLoading: false })
      toast.error(message)
      return false
    }
  },

  // Register user
  register: async (userData) => {
    try {
      set({ isLoading: true, error: null })
      await api.post('/auth/register', userData)
      
      toast.success('Registration successful! Please login.')
      set({ isLoading: false })
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      set({ error: message, isLoading: false })
      toast.error(message)
      return false
    }
  },

  // Fetch current user
  fetchUser: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false })
      return
    }

    try {
      set({ isLoading: true })
      
      // Parse the JWT token to get the user info
      // This avoids an extra API call, as the user data is embedded in the token
      const payload = JSON.parse(atob(token.split('.')[1]))
      
      set({ 
        user: {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role
        }, 
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error) {
      console.error('Error parsing token:', error)
      localStorage.removeItem('token')
      set({ user: null, isAuthenticated: false, isLoading: false, error: 'Session expired' })
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, isAuthenticated: false })
    toast.success('Logged out successfully')
  },

  // Check if user has required role
  hasRole: (roles) => {
    const { user } = get()
    if (!user) return false
    if (!roles || roles.length === 0) return true
    
    return roles.includes(user.role)
  }
}))