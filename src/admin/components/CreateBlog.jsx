import React, { useEffect } from "react";
import BlogForm from "./BlogForm";

export default function CreateBlog() {
  useEffect(() => {
    // Check for authentication token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to create a blog.");
      window.location.href = "/login";
    }
  }, []);

  const handleSubmit = async (form) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized! Please log in again.");
        window.location.href = "/login";
        return;
      }

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("author", form.author);
      fd.append("category", form.category);
      fd.append("tags", form.tags);
      fd.append("isPublished", form.isPublished);
      fd.append("htmlContent", form.htmlContent);

      // Store content as JSON (for Editor.js or similar)
      fd.append(
        "content",
        JSON.stringify({
          time: Date.now(),
          blocks: [{ type: "paragraph", data: { text: form.htmlContent } }],
        })
      );

      if (form.image) fd.append("image", form.image);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blogs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ secure token header
        },
        body: fd,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = "/admin/blogs"; // redirect after success
      } else {
        alert("❌ Failed: " + (data.message || "Unknown error"));
        console.error("Response:", data);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-[#BB4D00]">📝 Create Blog</h1>
      <BlogForm onSubmit={handleSubmit} />
    </div>
  );
}