import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { http } from "../../../api/http";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import Textarea from "../../../shared/components/Textarea";

export default function CreatePostPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Technology",
    "Lifestyle",
    "Entertainment",
    "Gaming",
    "Education",
    "Business",
    "Other"
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !category) {
      toast.error("Title, content, and category are required");
      return;
    }

    if (!image) {
      toast.error("An image is required for the post");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("image", image);

      await http.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Post created successfully!");
      navigate("/");
    } catch (e) {
      console.error("Post creation error:", e);
      toast.error(e.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            New Article
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Share your thoughts with the world.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <Input
              label="Article Title"
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write a compelling title for your article..."
              className="text-2xl font-bold py-4"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">
              Category <span className="text-[#6BCA6E]">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-gray-800 text-white px-4 py-3 rounded focus:outline-none focus:border-[#6BCA6E] focus:ring-1 focus:ring-[#6BCA6E] transition-all"
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Featured Image (Required)
            </label>
            <div className="space-y-4">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6BCA6E] file:text-black hover:file:bg-[#5abc5d] cursor-pointer"
              />
              {imagePreview && (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl border border-gray-700 shadow-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <Textarea
              label="Article Content"
              id="content"
              required
              rows={20}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article here..."
              className="text-lg leading-relaxed"
            />
          </div>

          <div className="flex gap-4 pt-8 border-t border-gray-800">
            <Button type="submit" className="flex-1" loading={loading ? 1 : 0}>
              Publish Article
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/")}
              className="flex-1 bg-gray-800 hover:bg-gray-700 border-gray-600"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
