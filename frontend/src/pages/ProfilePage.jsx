import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { http } from "../api/http";

export default function ProfilePage() {
  const user = useSelector((s) => s.auth.user);
  const token = useSelector((s) => s.auth.token);

  const [tab, setTab] = useState("mine");  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const url = tab === "mine" ? "/posts/mine" : "/posts/voted";
      const res = await http.get(url);
      setPosts(res.data.posts || []);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) load();
  }, [tab, token]);

  if (!token) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-2 text-red-600">You must be logged in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="border rounded p-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="text-gray-600">
          {user?.name} — {user?.email}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("mine")}
          className={`px-3 py-2 rounded border ${
            tab === "mine" ? "bg-black text-white" : ""
          }`}
        >
          My Posts
        </button>

        <button
          onClick={() => setTab("voted")}
          className={`px-3 py-2 rounded border ${
            tab === "voted" ? "bg-black text-white" : ""
          }`}
        >
          My Votes
        </button>
      </div>

      {/* Content */}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div className="text-gray-600">No posts here yet.</div>
      )}

      {!loading &&
        !error &&
        posts.map((post) => (
          <div key={post._id} className="border rounded p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <span className="text-sm text-gray-600">
                Votes: {post.votesCount || 0}
              </span>
            </div>

            <p className="text-gray-800">{post.content}</p>

            <div className="text-xs text-gray-500">
              By {post.author?.name || "Unknown"}
            </div>
          </div>
        ))}
    </div>
  );
}
