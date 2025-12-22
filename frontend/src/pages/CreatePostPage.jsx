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
          <input className="border p-2 rounded w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <select className="border p-2 rounded w-full" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>General</option>
            <option>Tech</option>
            <option>Life</option>
            <option>Sports</option>
            <option>Opinion</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Image</label>
          <div className="flex flex-col items-start gap-3">
            <label className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center cursor-pointer transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Select Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>

            {image && (
              <div className="relative mt-2">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="h-48 w-full object-cover rounded-lg border border-gray-300 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1">Content</label>
          <textarea className="border p-2 rounded w-full" rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
        </div>

        {error && <div className="text-red-600">Error: {error}</div>}

        <button className="bg-black text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
