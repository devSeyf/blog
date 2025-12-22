import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { http } from "../api/http";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const token = useSelector((s) => s.auth.token);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 
  if (!token) {
    return (
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Create Post</h1>
        <p className="text-red-600">You must be logged in to create a post.</p>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const res = await http.post("/posts", { title, content });
 
      navigate("/posts");
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Create Post</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block mb-1">Title</label>
          <input
            className="border p-2 rounded w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
          />
        </div>

        <div>
          <label className="block mb-1">Content</label>
          <textarea
            className="border p-2 rounded w-full"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post..."
          />
        </div>

        {error && <div className="text-red-600">Error: {error}</div>}

        <button
          className="bg-black text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
