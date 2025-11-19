import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function BlogForm({ initialData, onSubmit }) {
  const [form, setForm] = useState(
    initialData || {
      title: "",
      author: "",
      category: "",
      tags: "",
      image: null,
      htmlContent: "",
      isPublished: true,
    }
  );

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🧠 Load existing image if editing
  useEffect(() => {
    if (initialData?.image && typeof initialData.image === "string") {
      setPreview(initialData.image);
    }
  }, [initialData]);

  // 📸 Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm({ ...form, image: file });
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        setPreview(fileUrl);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 🚀 Handle form submit with toast + loading overlay
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(
      initialData ? "Updating blog..." : "Creating blog..."
    );

    try {
      await onSubmit(form);
      toast.success(
        initialData ? "Blog updated successfully!" : "Blog created successfully!",
        { id: toastId }
      );
    } catch (err) {
      toast.error("Something went wrong! Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-white px-4 py-10 relative">
      {/* 🌀 Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col justify-center items-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#BB4D00] border-t-transparent mb-4"></div>
          <p className="text-[#BB4D00] font-semibold text-lg">
            {initialData ? "Updating Blog..." : "Creating Blog..."}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-3xl bg-white shadow-lg border border-orange-100 rounded-2xl p-8 space-y-6 transition-all duration-300 hover:shadow-2xl ${
          loading ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <h2 className="text-2xl font-semibold text-[#BB4D00] mb-6 text-center">
          {initialData ? "Update Blog" : "Create New Blog"}
        </h2>

        {/* Title & Author */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#BB4D00] outline-none"
              placeholder="Enter blog title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Author
            </label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#BB4D00] outline-none"
              placeholder="Author name"
            />
          </div>
        </div>

        {/* Category & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#BB4D00] outline-none"
              placeholder="e.g. Technology, Lifestyle"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Tags (comma separated)
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#BB4D00] outline-none"
              placeholder="react, frontend, javascript"
            />
          </div>
        </div>

        {/* Image Upload with Preview */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Cover Image
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full sm:w-2/3 border border-gray-300 rounded-lg p-2.5 cursor-pointer focus:ring-2 focus:ring-[#BB4D00] outline-none"
            />

            {preview && (
              <div className="w-32 h-32 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Blog Content */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Blog Content
          </label>
          <textarea
            name="htmlContent"
            value={form.htmlContent}
            onChange={handleChange}
            rows="6"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#BB4D00] outline-none resize-none"
            placeholder="Write your blog content here..."
          ></textarea>
        </div>

        {/* Publish Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isPublished"
            checked={form.isPublished}
            onChange={(e) =>
              setForm({ ...form, isPublished: e.target.checked })
            }
            className="h-4 w-4 accent-[#BB4D00] cursor-pointer"
          />
          <label className="text-sm text-gray-700">Publish this blog</label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#BB4D00] hover:bg-[#a34200] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            {initialData ? "Update Blog" : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}