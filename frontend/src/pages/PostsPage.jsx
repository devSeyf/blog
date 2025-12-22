import { useEffect, useState } from "react";
import { http } from "../api/http";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await http.get("/posts");
        setPosts(res.data.posts);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">All Posts</h1>

      {posts.length === 0 && <div>No posts yet.</div>}

      {posts.map((post) => (
        <div key={post._id} className="border p-4 rounded space-y-2">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p>{post.content}</p>
          <div className="text-sm text-gray-500">
            By {post.author?.name || "Unknown"}
          </div>
        </div>
      ))}
    </div>
  );
}
    