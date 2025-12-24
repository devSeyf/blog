import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "../../../api/http";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

const CATEGORIES = ["Tech", "Design", "Random", "News", "Hacking", "Crypto"];

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Tech");
  const [file, setFile] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const res = await http.get(`/posts/${id}`);
        const p = res.data.post;
        setTitle(p.title || "");
        setContent(p.content || "");
        setCategory(p.category || "Tech");
        setCurrentImage(p.imageUrl || "");
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      if (file) formData.append("image", file);

      await http.put(`/posts/${id}`, formData);

      setSaving(false);
      navigate("/", { state: { refresh: Date.now() } });
    } catch (e2) {
      setSaving(false);
      setError(e2.response?.data?.message || e2.message);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">

      <div className="rounded-lg border border-[#6BCA6E]/20 bg-[#0a0a0a] p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Post</h1>

        {error && (
          <div className="mb-6 rounded border border-red-500/50 bg-red-900/10 p-4 text-sm text-red-500">
            ERROR: {error}
          </div>
        )}

        {currentImage && (
          <img
            src={currentImage}
            alt="current"
            className="mb-4 w-full max-h-64 object-cover rounded border border-gray-800"
          />
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <Input
            label="Title"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="w-full">
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-gray-800 text-white px-4 py-3 rounded"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">
              Content
            </label>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-gray-800 text-white px-4 py-3 rounded"
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">
              Replace Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-400"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
