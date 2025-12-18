import React, { useEffect, useState } from "react";
import { useSubCategoryStore } from "../../store/useSubCategoryStore";
import { useParams } from "react-router-dom";
import { X, Upload, Edit2, Trash2, Power, Search, Plus, Image } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { Link } from "react-router-dom";

export default function SubCategoryPage() {
  const params = useParams();
  const categoryId = params?.Slug;
  

  const {
    subCategories,
    loading,
    error,
    successMessage,
    fetchSubCategoryByCategorySlug,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    toggleSubCategoryStatus,
    clearMessages,
  } = useSubCategoryStore();

  const [form, setForm] = useState({ name: "", image: null });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (categoryId) fetchSubCategoryByCategorySlug(categoryId);
    return () => clearMessages();
  }, [categoryId]);

  // Watch for errors or success messages from the store and show toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearMessages();
    }
    if (successMessage) {
      toast.success(successMessage);
      clearMessages();
    }
  }, [error, successMessage]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setForm({ ...form, image: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !categoryId) return toast.error("Name and category are required");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", categoryId);
    if (form.image) formData.append("image", form.image);

    try {
      if (editingId) {
        await updateSubCategory(editingId, formData);
        setEditingId(null);
      } else {
        await createSubCategory(formData);
      }
      setForm({ name: "", image: null });
      setImagePreview(null);
      setShowForm(false);
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    }
  };

  const handleEdit = (sub) => {
    setEditingId(sub._id);
    setForm({ name: sub.name, image: null });
    setImagePreview(sub.image);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await deleteSubCategory(id);
      } catch (err) {
        toast.error(err.message || "Failed to delete subcategory");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleSubCategoryStatus(id);
    } catch (err) {
      toast.error(err.message || "Failed to toggle status");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", image: null });
    setImagePreview(null);
    setShowForm(false);
  };

  const filteredSubCategories = subCategories.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
console.log("Filtered Subcategories:", filteredSubCategories);
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Subcategories</h1>
          <p className="text-gray-600">Manage subcategories for your catalog</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Add Subcategory
          </button>
        </div>

        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingId ? "Edit Subcategory" : "Create New Subcategory"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter subcategory name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition text-center">
                      <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                      <p className="text-sm text-gray-600">Click to upload image (500 X 500)px</p>
                    </div>
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setForm({ ...form, image: null });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium"
                >
                  {loading ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subcategory Cards (unchanged) */}
        {!loading && filteredSubCategories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSubCategories.map((sub) => (
              <div key={sub._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-200 group">
                <div className="relative h-48 bg-gray-100">
                  {sub.image ? (
                    <img src={sub.image} alt={sub.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="text-gray-300" size={48} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sub.isActive ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                      {sub.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">{sub.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 truncate">{sub.category?.name || "No category"}</p>
                   <Link to={`/admin/category/${categoryId}/${sub._id}`} className="text-blue-600 hover:underline">
      Products
    </Link>
    

                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(sub)} className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-1" title="Edit"><Edit2 size={16} /></button>
                    <button onClick={() => handleToggleStatus(sub._id)} className={`flex-1 ${sub.isActive ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-green-50 hover:bg-green-100 text-green-700"} px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-1`} title={sub.isActive ? "Deactivate" : "Activate"}><Power size={16} /></button>
                    <button onClick={() => handleDelete(sub._id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-1" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}