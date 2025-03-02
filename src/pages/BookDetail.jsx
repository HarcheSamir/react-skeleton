// src/pages/BookDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'
import { useAuthStore } from '../store/authStore'
import Layout from '../components/Layout'

const BookDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentBook, fetchBookById, deleteBook, isLoading } = useBookStore()
  const { hasRole } = useAuthStore()
  const isAdmin = hasRole(['ADMIN'])
  
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  useEffect(() => {
    fetchBookById(parseInt(id))
  }, [fetchBookById, id])
  
  const handleDelete = async () => {
    const success = await deleteBook(parseInt(id))
    if (success) {
      navigate('/books')
    }
  }
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }
  
  if (!currentBook) {
    return (
      <Layout>
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Book not found</h1>
          <p className="text-gray-600 mb-4">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/books" className="text-blue-600 hover:underline">
            Return to book list
          </Link>
        </div>
      </Layout>
    )
  }
  
  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{currentBook.title}</h1>
          
          {isAdmin && (
            <div className="flex space-x-2">
              <Link
                to={`/books/${id}/edit`}
                className="btn-secondary"
              >
                Edit
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Author</h2>
            <p className="text-gray-600">{currentBook.author}</p>
          </div>
          
          {currentBook.description && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Description</h2>
              <p className="text-gray-600">{currentBook.description}</p>
            </div>
          )}
          
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Published</h2>
            <p className="text-gray-600">
              {currentBook.publishedAt 
                ? new Date(currentBook.publishedAt).toLocaleDateString() 
                : 'Not specified'}
            </p>
          </div>
          
          <div className="pt-4 border-t">
            <Link to="/books" className="text-blue-600 hover:underline">
              ← Back to book list
            </Link>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{currentBook.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default BookDetail