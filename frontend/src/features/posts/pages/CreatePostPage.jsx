import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../../../api/http";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

const CATEGORIES = ["Tech", "Design", "Random", "News", "Hacking", "Crypto"];

export default function CreatePostPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Tech");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // ← بدون setTimeout

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      if (file) formData.append("image", file);

      const res = await http.post("/posts", formData);

      navigate("/", {
        state: { refresh: Date.now(), createdPostId: res.data?.post?._id },
      });
    } catch (e2) {
      setError(e2.response?.data?.message || e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="rounded-lg border border-[#6BCA6E]/20 bg-[#0a0a0a] p-8 shadow-[0_0_30px_rgba(107,202,110,0.05)]">
        <div className="mb-8 border-l-4 border-[#6BCA6E] pl-4">
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">
            New Transmission
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Initialize a new data packet for the network.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded border border-red-500/50 bg-red-900/10 p-4 text-sm text-red-500">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <Input
            label="Title / Subject"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter transmission subject..."
          />

          <div className="w-full">
            <label htmlFor="category" className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-gray-800 text-white px-4 py-3 rounded focus:outline-none focus:border-[#6BCA6E] focus:ring-1 focus:ring-[#6BCA6E] transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label htmlFor="file" className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">
              Attachment (Image) <span className="text-[#6BCA6E]">*</span>
            </label>
            <input
              type="file"
              id="file"
              accept="image/*"
              required
              onChange={handleFileChange}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#6BCA6E] file:text-black hover:file:bg-[#5abc5d] cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="content" className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">
              Message Content <span className="text-[#6BCA6E]">*</span>
            </label>
            <textarea
              id="content"
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-gray-800 text-white px-4 py-3 rounded focus:outline-none focus:border-[#6BCA6E] focus:ring-1 focus:ring-[#6BCA6E] transition-all placeholder-gray-600 resize-y"
              placeholder="Enter encrypted message here..."
            />
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Transmitting..." : "Create Blog Post"}
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
