import React, { useEffect, useState } from "react";
import { useCategoryStore } from "../../store/categoryStoreCards";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaTrash, FaUpload } from "react-icons/fa";

const CategoryCardsManager = () => {
  const {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    loading,
  } = useCategoryStore();

  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    link: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (formData.name.trim()) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // ---------------------------
  //  SUBMIT WITH LOADING
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        toast.success("Category updated successfully!");
        setEditingId(null);
      } else {
        await addCategory(formData);
        toast.success("Category added successfully!");
      }

      setFormData({
        name: "",
        description: "",
        slug: "",
        link: "",
        image: null,
      });

      setPreview(null);
    } catch (error) {
      toast.error("Something went wrong!");
    }

    setProcessing(false);
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
      link: category.link,
      image: null,
    });
    setPreview(category.image);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4">
      <Toaster position="top-right" />

      {/* =============================
          FULL SCREEN LOADING OVERLAY
      ============================== */}
      {(loading || processing) && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col justify-center items-center z-50">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-amber-700 font-medium">
            {processing ? "Processing... Please wait" : "Loading categories..."}
          </p>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white backdrop-blur-lg shadow-xl border border-orange-100 rounded-3xl p-10">
        <h1 className="text-4xl font-extrabold text-amber-600 mb-10 text-center tracking-wide">
          Manage Categories
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          encType="multipart/form-data"
        >
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-amber-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Product Link
            </label>
            <input
              type="text"
              placeholder="Enter product link"
              className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-amber-500"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Write a short description"
              className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-amber-500"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-1">
              Upload Image (1024x1024 px recommended)
            </label>
            <div className="flex items-center gap-4 bg-orange-50 border border-orange-200 p-4 rounded-xl">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              <FaUpload className="text-amber-600 text-xl" />
            </div>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 rounded-xl h-36 object-cover shadow-lg border"
              />
            )}
          </div>

          <button
            type="submit"
            className="md:col-span-2 bg-amber-600 text-white font-semibold py-4 rounded-xl hover:bg-amber-700 transition-all shadow-md"
          >
            {editingId ? "Update Category" : "Add Category"}
          </button>
        </form>

        {/* CATEGORY LIST */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white shadow-lg rounded-2xl border border-amber-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />

                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">
                    {category.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition"
                    >
                      <FaEdit /> Edit
                    </button>

                    <button
                      onClick={() => {
                        deleteCategory(category._id);
                        toast.success("Category deleted successfully!");
                      }}
                      className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCardsManager;