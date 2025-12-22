import { useEffect, useState } from "react";
import { http } from "../api/http";
import { useSelector } from "react-redux";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector((s) => s.auth.user);
  const token = useSelector((s) => s.auth.token);

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

  const hasVoted = (post) => {
    if (!user) return false;
    const userId = String(user._id || user.id);
    return (post.voters || []).some((v) => String(v) === userId);
  };

  const handleVote = async (postId) => {
    try {
      const res = await http.post(`/posts/${postId}/vote`);
      const updatedPost = res.data.post;

      
      setPosts((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">All Posts</h1>

      {posts.length === 0 && <div>No posts yet.</div>}

      {posts.map((post) => {
        const voted = hasVoted(post);

        return (
          <div key={post._id} className="border p-4 rounded space-y-2">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p>{post.content}</p>

            <div className="text-sm text-gray-500">
              By {post.author?.name || "Unknown"} • Votes: {post.votesCount || 0}
            </div>

            {!token ? (
              <div className="text-sm text-gray-400">Login to vote</div>
            ) : (
              <button
                onClick={() => handleVote(post._id)}
                disabled={voted}
                className={`px-3 py-1 rounded text-white ${
                  voted ? "bg-gray-400" : "bg-blue-600"
                }`}
              >
                {voted ? "Voted" : "Vote"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
