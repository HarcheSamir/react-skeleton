// src/pages/EditBook.jsx
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBookStore } from '../store/bookStore'
import { useFormWithValidation } from '../hooks/useFormWithValidation'
import { bookSchema } from '../utils/schemas'
import Layout from '../components/Layout'

const EditBook = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentBook, fetchBookById, updateBook, isLoading } = useBookStore()
  
  const { register, handleSubmit, formState: { errors }, reset } = useFormWithValidation(bookSchema)
  
  useEffect(() => {
    const loadBook = async () => {
      const book = await fetchBookById(parseInt(id))
      if (book) {
        // Format the date for the date input (YYYY-MM-DD)
        const formattedDate = book.publishedAt 
          ? new Date(book.publishedAt).toISOString().split('T')[0] 
          : ''
          
        reset({
          ...book,
          publishedAt: formattedDate
        })
      } else {
        // Redirect to books list if book not found
        navigate('/books')
      }
    }
    
    loadBook()
  }, [fetchBookById, id, navigate, reset])
  
  const onSubmit = async (data) => {
    const bookData = {
      ...data,
      publishedAt: data.publishedAt || null
    }
    
    const updatedBook = await updateBook(parseInt(id), bookData)
    if (updatedBook) {
      navigate(`/books/${updatedBook.id}`)
    }
  }
  
  if (isLoading && !currentBook) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }
  
  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Book</h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                className="form-input"
                placeholder="Book title"
                {...register('title')}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="form-error">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                id="author"
                type="text"
                className="form-input"
                placeholder="Author name"
                {...register('author')}
                disabled={isLoading}
              />
              {errors.author && (
                <p className="form-error">{errors.author.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="form-input"
                placeholder="Book description"
                {...register('description')}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="form-error">{errors.description.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 mb-1">
                Publication Date
              </label>
              <input
                id="publishedAt"
                type="date"
                className="form-input"
                {...register('publishedAt')}
                disabled={isLoading}
              />
              {errors.publishedAt && (
                <p className="form-error">{errors.publishedAt.message}</p>
              )}
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/books/${id}`)}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Saving...
                  </span>
                ) : (
                  'Update Book'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default EditBook