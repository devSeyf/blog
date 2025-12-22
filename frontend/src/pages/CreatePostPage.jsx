import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { http } from "../api/http";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const token = useSelector((s) => s.auth.token);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!token) {
    return <div className="p-6 text-red-600">You must be logged in.</div>;
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Please choose an image.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const form = new FormData();
      form.append("title", title);
      form.append("content", content);
      form.append("category", category);
      form.append("image", image);

      await http.post("/posts", form); 
      // ملاحظة: لا تضع Content-Type بنفسك، Axios يضبط boundary تلقائيًا

      navigate("/posts");
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create Post</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block mb-1">Title</label>
          <input className="border p-2 rounded w-full" value={title} onChange={(e)=>setTitle(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <select className="border p-2 rounded w-full" value={category} onChange={(e)=>setCategory(e.target.value)}>
            <option>General</option>
            <option>Tech</option>
            <option>Life</option>
            <option>Sports</option>
            <option>Opinion</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded w-full"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label className="block mb-1">Content</label>
          <textarea className="border p-2 rounded w-full" rows={6} value={content} onChange={(e)=>setContent(e.target.value)} />
        </div>

        {error && <div className="text-red-600">Error: {error}</div>}

        <button className="bg-black text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
