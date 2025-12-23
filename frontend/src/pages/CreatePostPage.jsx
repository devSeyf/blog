import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/http";
import LoadingOverlay from "../components/LoadingOverlay";
import Input from "../components/Input";
import Button from "../components/Button";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // We assume text content for now
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const start = Date.now();

    try {
      await http.post("/posts", { title, content, category, imageUrl });

      const elapsed = Date.now() - start;
      const delay = Math.max(0, 800 - elapsed);

      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, delay);

    } catch (e) {
      setLoading(false);
      setError(e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <LoadingOverlay visible={loading} />

      <div className="rounded-lg border border-[#6BCA6E]/20 bg-[#0a0a0a] p-8 shadow-[0_0_30px_rgba(107,202,110,0.05)]">

        <div className="mb-8 border-l-4 border-[#6BCA6E] pl-4">
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">New Transmission</h1>
          <p className="text-gray-400 text-sm mt-1">Initialize a new data packet for the network.</p>
        </div>

        {error && (
          <div className="mb-6 rounded border border-red-500/50 bg-red-900/10 p-4 text-sm text-red-500">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title / Subject"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter transmission subject..."
          />

          <Input
            label="Category (Optional)"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. TECH, INTEL, MEME"
          />

          <Input
            label="Image Frequency URL (Optional)"
            id="image"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
          />

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
            <Button type="submit" className="flex-1">
              Broadcast Message
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
