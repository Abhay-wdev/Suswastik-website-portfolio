import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogForm from "./BlogForm";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to edit blogs.");
      navigate("/login");
      return;
    }

    const fetchBlog = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ include token
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch blog");

        setBlog(data.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        alert("Unauthorized or blog not found!");
        navigate("/admin/blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const handleSubmit = async (form) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! Please log in again.");
      navigate("/login");
      return;
    }

    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blogs/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ token added for update request
        },
        body: fd,
      });

      if (res.ok) {
        navigate("/admin/blogs");
      } else {
        const errData = await res.json();
        alert("❌ Failed: " + (errData.message || "Update failed"));
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Something went wrong while updating the blog.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!blog) return <p className="text-center mt-10">Blog not found.</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Edit Blog</h1>
      <BlogForm initialData={blog} onSubmit={handleSubmit} />
    </div>
  );
}