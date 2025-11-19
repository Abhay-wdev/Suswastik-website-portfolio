import React, { useEffect, useState } from "react";
import { useCategoryStore } from "../../store/CategoryStore";
import {
  Pencil, Trash2, Plus, X, Upload, Loader2, AlertCircle, CheckCircle, Search, Eye, Package
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

// ============================
// CATEGORY FORM MODAL
// ============================
function CategoryFormModal({ category, onClose, token }) {
  const { createCategory, updateCategory } = useCategoryStore();
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    isActive: category?.isActive ?? true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(category?.image || '');
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Category name is required');

    setSubmitting(true);
    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('description', formData.description.trim());
    data.append('isActive', formData.isActive);
    if (imageFile) data.append('image', imageFile);

    try {
      if (category) {
        await updateCategory(category._id, data, token);
        toast.success('Category updated successfully!');
      } else {
        await createCategory(data, token);
        toast.success('Category created successfully!');
      }
      onClose();
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {category ? 'Edit Category' : 'Create New Category'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={submitting}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Clothing"
              disabled={submitting}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter description..."
              disabled={submitting}
            ></textarea>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition disabled:opacity-50">
                <Upload size={18} className="mr-2" /> Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={submitting}
                />
              </label>
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover rounded-md border w-16 h-16"
                  />
                  {imageFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(category?.image || "");
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      disabled={submitting}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={submitting}
              />
              <label
                htmlFor="isActive"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Active Status
              </label>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                formData.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {formData.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  {category ? "Updating..." : "Creating..."}
                </>
              ) : category ? (
                "Update Category"
              ) : (
                "Create Category"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================
// CATEGORY DETAIL MODAL
// ============================
function CategoryDetailModal({ category, onClose, onEdit }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Category Details
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {category.image ? (
            <div className="w-20 h-20 relative">
              <img
                src={category.image}
                alt={category.name}
                className="object-cover rounded-lg border w-full h-full"
              />
            </div>
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-lg font-medium">
                {category.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="text-lg font-semibold text-gray-900">{category.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Slug</label>
            <p className="text-gray-700 font-mono text-sm">{category.slug}</p>
          </div>
          {category.description && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Description
              </label>
              <p className="text-gray-700">{category.description}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="mt-1">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  category.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {category.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Created
              </label>
              <p className="text-sm text-gray-700">
                {new Date(category.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Updated
              </label>
              <p className="text-sm text-gray-700">
                {new Date(category.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(category);
            }}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Pencil size={16} className="mr-2" />
            Edit Category
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================
// MAIN CATEGORY MANAGER
// ============================
export default function CategoryManager() {
  const {
    categories,
    loading,
    error,
    successMessage,
    fetchCategories,
    deleteCategory,
    toggleCategoryStatus,
    clearMessages,
  } = useCategoryStore();

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    fetchCategories();
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, [fetchCategories]);

  useEffect(() => {
    if (error) toast.error(error);
    if (successMessage) toast.success(successMessage);
    if (error || successMessage) {
      const timer = setTimeout(() => clearMessages(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, clearMessages]);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?'))
      await deleteCategory(id, token);
  };

  const handleToggleStatus = async (id) => await toggleCategoryStatus(id, token);

  const filteredCategories = searchTerm.trim()
    ? categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-6 border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Category Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage your product categories ({categories.length} total)
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm"
            >
              <Plus size={20} className="mr-2" /> Add Category
            </button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-gray-500">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <AlertCircle className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {searchTerm ? "No categories found" : "No categories yet"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Create your first category to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCategories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-12 h-12 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-xs font-medium">
                              {cat.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {cat.name}
                        </div>
                        <div className="text-sm text-gray-500 font-mono">
                          {cat.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {cat.description || (
                          <span className="text-gray-400">No description</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(cat._id)}
                          className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                            cat.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                        <button
                          onClick={() => setViewingCategory(cat)}
                          className="text-gray-600 hover:text-blue-600 transition"
                        >
                          <Eye size={18} />
                        </button>
                        <a href={`/admin/category/${cat._id}`} className="text-purple-600 hover:text-purple-800 transition" title="View Products">
                          <Package size={18} />
                        </a>
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modals */}
        {showForm && (
          <CategoryFormModal
            category={editingCategory}
            onClose={() => {
              setShowForm(false);
              setEditingCategory(null);
            }}
            token={token}
          />
        )}
        {viewingCategory && (
          <CategoryDetailModal
            category={viewingCategory}
            onClose={() => setViewingCategory(null)}
            onEdit={(cat) => {
              setEditingCategory(cat);
              setShowForm(true);
            }}
          />
        )}
      </div>
    </div>
  );
}