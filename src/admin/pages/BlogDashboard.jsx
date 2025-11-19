import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BlogDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Base API URL (Change to your deployed backend when needed)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect if not logged in
    if (!token) {
      alert("Please login to access the dashboard.");
      window.location.href = "/login";
      return;
    }

    // Fetch blogs if token exists
    fetchBlogs(token);
  }, []);

  // Fetch blogs with token
  const fetchBlogs = async (token) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/blogs`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ include token
        },
      });

      setBlogs(res.data.data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      if (error.response?.status === 401) {
        alert("Session expired! Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete a blog securely
  const deleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! Please log in again.");
      window.location.href = "/login";
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ include token
        },
      });

      setBlogs((prev) => prev.filter((b) => b._id !== id));
      alert("🗑 Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("❌ Failed to delete blog.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Blog Management</h1>
        <a
          href="/admin/blogs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + New Blog
        </a>
      </div>

      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="border rounded-xl p-4 shadow-sm bg-white"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              )}
              <h2 className="font-bold text-lg">{blog.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p
                className="text-gray-700 line-clamp-3 text-sm"
                dangerouslySetInnerHTML={{
                  __html:
                    blog.htmlContent?.slice(0, 150) ||
                    blog.content?.blocks?.[0]?.data?.text ||
                    "",
                }}
              />
              <div className="flex justify-between mt-4">
                <a
                  href={`/admin/blogs/${blog._id}`}
                  className="text-blue-600 text-sm"
                >
                  ✏️ Edit
                </a>
                <button
                  onClick={() => deleteBlog(blog._id)}
                  className="text-red-500 text-sm"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}