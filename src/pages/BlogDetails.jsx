import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/blogs/slug/${slug}`
        );

        if (res.data?.success) {
          setBlog(res.data.data);
        } else {
          setBlog(null);
        }
      } catch (error) {
        console.error("Error loading blog:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [slug]);

  if (loading)
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-gray-600">
        Loading...
      </div>
    );

  if (!blog)
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-gray-600">
        <h1 className="text-3xl font-semibold text-red-500 mb-4">
          Blog Not Found
        </h1>
        <p>This article may have been moved or deleted.</p>
      </div>
    );

  const cleanHTML = DOMPurify.sanitize(blog.htmlContent || "");

  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      {/* Title */}
      <h1 className="text-4xl font-bold text-[#bb4d00] mb-3">
        {blog.title}
      </h1>

      {/* Metadata */}
      <p className="text-gray-600 mb-6">
        By <span className="font-medium">{blog.author}</span> in{" "}
        <span className="italic">{blog.category}</span>
      </p>

      {/* Image */}
      {blog.image && (
        <div className="w-full h-[400px] mb-8 rounded-2xl overflow-hidden shadow-md">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg max-w-none text-gray-800 blog-content list-disc list-inside"
        dangerouslySetInnerHTML={{ __html: cleanHTML }}
      />
    </article>
  );
}
