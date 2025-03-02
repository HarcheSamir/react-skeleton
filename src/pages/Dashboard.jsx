// src/pages/Dashboard.jsx
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useBookStore } from '../store/bookStore'
import Layout from '../components/Layout'

const Dashboard = () => {
  const { user } = useAuthStore()
  const { books, fetchBooks, isLoading } = useBookStore()

  useEffect(() => {
    // Fetch the first page of books for the dashboard
    fetchBooks(1, 5)
  }, [fetchBooks])

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome, {user?.name}
        </h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Recent Books
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : books.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Published
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books.map((book) => (
                      <tr key={book.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {book.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {book.author}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {book.publishedAt 
                              ? new Date(book.publishedAt).toLocaleDateString() 
                              : 'Not specified'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            to={`/books/${book.id}`}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No books found. 
                {user?.role === 'ADMIN' && (
                  <Link to="/books/create" className="text-blue-600 hover:underline ml-1">
                    Add one?
                  </Link>
                )}
              </div>
            )}
            
            <div className="mt-4">
              <Link 
                to="/books" 
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                View all books →
              </Link>
            </div>
          </div>

          {user?.role === 'ADMIN' && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Admin Actions
              </h2>
              <div className="space-y-2">
                <Link 
                  to="/books/create"
                  className="block text-blue-600 hover:underline"
                >
                  Add new book
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard