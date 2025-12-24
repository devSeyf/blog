import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { http } from "../../../api/http";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import Textarea from "../../../shared/components/Textarea";

export default function CreatePostPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Technology", "Science", "Lifestyle", "Politics", "Sports", 
    "Entertainment", "Business", "Health", "Travel", "Food"
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (category) formData.append("category", category);
      if (image) formData.append("image", image);

      await http.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Post created successfully!");
      navigate("/");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-[calc(100vh-64px)] w-full text-white">
      <div className="w-full max-w-3xl flex-col items-center py-10 px-4">
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#6BCA6E] pl-4">
            New Post
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <Input
            label="Title"
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-[#6BCA6E] focus:border-transparent transition-all"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Featured Image (Optional)
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6BCA6E] file:text-black hover:file:bg-[#5abc5d]"
            />
            {imagePreview && (
              <div className="mt-4 relative group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <Textarea
            label="Content"
            id="content"
            required
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
          />

          <div className="flex justify-center items-center gap-4 pt-8 border-t border-gray-800">
            <Button type="submit" className="px-8 py-2" loading={loading}>
              Publish
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/")}
              className="px-8 py-2 bg-gray-800 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
