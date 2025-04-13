// src/store/bookStore.js
import { create } from 'zustand'
import { api } from '../services/api'
import toast from 'react-hot-toast'

export const useBookStore = create((set, get) => ({
  books: [],
  currentBook: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },

  // Fetch books with pagination
  fetchBooks: async (page = 1, limit = 10) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.get('/book', {
        params: { page, limit }
      })

      set({ 
        books: response.data.data,
        pagination: response.data.pagination,
        isLoading: false
      })
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch books'
      set({ error: message, isLoading: false })
      toast.error(message)
    }
  },

  // Fetch single book by ID
  fetchBookById: async (id) => {
    try {
      set({ isLoading: true, error: null, currentBook: null })
      const response = await api.get(`/book/${id}`)
      set({ currentBook: response.data, isLoading: false })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch book'
      set({ error: message, isLoading: false })
      toast.error(message)
      return null
    }
  },

  // Create a new book
  createBook: async (bookData) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.post('/book', bookData)
      
      // Update the book list
      const { books } = get()
      set({ books: [response.data, ...books], isLoading: false })
      
      toast.success('Book created successfully')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create book'
      set({ error: message, isLoading: false })
      toast.error(message)
      return null
    }
  },

  // Update a book
  updateBook: async (id, bookData) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.put(`/book/${id}`, bookData)
      
      // Update the books list and current book
      const { books } = get()
      const updatedBooks = books.map(book => 
        book.id === id ? response.data : book
      )
      
      set({ 
        books: updatedBooks, 
        currentBook: response.data,
        isLoading: false 
      })
      
      toast.success('Book updated successfully')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update book'
      set({ error: message, isLoading: false })
      toast.error(message)
      return null
    }
  },

  // Delete a book
  deleteBook: async (id) => {
    try {
      set({ isLoading: true, error: null })
      await api.delete(`/book/${id}`)
      
      // Update the books list
      const { books } = get()
      const filteredBooks = books.filter(book => book.id !== id)
      
      set({ books: filteredBooks, isLoading: false })
      
      toast.success('Book deleted successfully')
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete book'
      set({ error: message, isLoading: false })
      toast.error(message)
      return false
    }
  },

  // Reset current book
  resetCurrentBook: () => {
    set({ currentBook: null })
  }
}))