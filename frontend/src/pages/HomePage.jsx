import { useEffect, useState } from "react";
import { http } from "../api/http";
import { useSelector } from "react-redux";

export default function HomePage() {
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
    <div className="relative min-h-screen">
      {/* Background */}
      {/* Background removed - moved to AppLayout */}

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-start px-4 py-10">
        <div className="w-full max-w-3xl space-y-6">
          <h1 className="text-2xl font-bold text-white">All Posts</h1>

          {posts.length === 0 && (
            <div className="text-slate-200">No posts yet.</div>
          )}

          {posts.map((post) => {
            const voted = hasVoted(post);

            return (
              <div
                key={post._id}
                className="mb-4 space-y-2 rounded border border-slate-700 bg-slate-900/60 p-4 backdrop-blur"
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full max-h-64 rounded object-cover"
                  />
                )}

                {post.category && (
                  <div className="text-xs text-slate-400">
                    Category:{" "}
                    <span className="font-semibold text-slate-200">
                      {post.category}
                    </span>
                  </div>
                )}

                <h2 className="text-xl font-semibold text-white">
                  {post.title}
                </h2>
                <p className="text-slate-200 line-clamp-3">{post.content}</p>

                <div className="text-sm text-slate-400">
                  By {post.author?.name || "Unknown"} • Votes:{" "}
                  {post.votesCount || 0}
                </div>

                {!token ? (
                  <div className="text-sm text-slate-400">Login to vote</div>
                ) : (
                  <button
                    onClick={() => handleVote(post._id)}
                    disabled={voted}
                    className={`px-3 py-1 rounded text-white ${voted ? "bg-gray-500" : "bg-sky-600 hover:bg-sky-500"
                      }`}
                  >
                    {voted ? "Voted" : "Vote"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
