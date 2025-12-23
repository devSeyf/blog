import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { http } from "../../../api/http";

import LoadingOverlay from "../../../shared/components/LoadingOverlay";
export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector((s) => s.auth.user);
  const token = useSelector((s) => s.auth.token);


  const location = useLocation();
  const navigate = useNavigate();

  const refreshKey = location.state?.refresh;

useEffect(() => {
  let timerId;

  const fetchPosts = async () => {
    setError(null);

     
    timerId = setTimeout(() => {
      setLoading(true);
    }, 250);

    try {
      const res = await http.get("/posts");
      setPosts(res.data.posts || []);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      clearTimeout(timerId);
      setLoading(false);  
    }
  };

  fetchPosts();

 
  return () => clearTimeout(timerId);
}, [refreshKey]);



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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="rounded border border-red-500/50 bg-red-900/10 p-6 text-red-500">
          <h2 className="mb-2 text-xl font-bold">SYSTEM ERROR</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center min-h-[calc(100vh-64px)] w-full">
      {loading && <LoadingOverlay visible={loading} />}

      <div
        className={`w-full max-w-3xl flex-col items-center py-10 px-4 transition-opacity duration-700 ${loading ? "opacity-0" : "opacity-100"
          }`}
      >
        <h2 className="mb-6 w-full text-left text-2xl font-bold text-white border-l-4 border-[#6BCA6E] pl-4">
          All Posts
        </h2>

        {posts.length === 0 && (
          <div className="w-full rounded border border-dashed border-gray-700 p-8 text-center text-gray-500">
            No signal detected.
          </div>
        )}

        <div className="w-full space-y-6">
          {posts.map((post) => {
            const isOwner = user && String(post.author?._id || post.author) === String(user._id || user.id);

            const voted = hasVoted(post);

            return (
              <div
                key={post._id}
                className="group relative overflow-hidden rounded-xl bg-[#0a0a0a] border border-gray-800 p-6 transition-all duration-300 hover:border-[#6BCA6E]/50 hover:shadow-[0_10px_30px_rgba(107,202,110,0.1)] hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-[#6BCA6E]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {post.imageUrl && (
                  <div className="mb-4 overflow-hidden rounded border border-gray-800">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-48 w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="mb-2 flex items-center justify-between">
                  {post.category && (
                    <span className="rounded bg-[#6BCA6E]/10 px-2 py-0.5 text-xs font-medium text-[#6BCA6E] border border-[#6BCA6E]/20">
                      {post.category}
                    </span>
                  )}
                  <span className="font-mono text-xs text-gray-500">
                    ID: {post._id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <h3 className="mb-2 text-xl font-bold text-white group-hover:text-[#6BCA6E] transition-colors">
                  {post.title}
                </h3>

                <p className="mb-4 text-gray-400 line-clamp-3">{post.content}</p>

                <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-4">
                  <div className="flex flex-col text-xs text-gray-500">
                    <span>
                      OP:{" "}
                      <span className="text-gray-300">
                        {post.author?.name || "Unknown"}
                      </span>
                    </span>
                    <span>
                      Votes:{" "}
                      <span className="text-[#6BCA6E]">
                        {post.votesCount || 0}
                      </span>
                    </span>
                  </div>

                  {!token ? (
                    <span className="text-xs text-gray-600 italic">
                      Login to decrypt
                    </span>
                  ) : (

                    <>
                      {token && isOwner && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/posts/${post._id}/edit`)}
                            title="Edit post"
                            className="rounded p-2 border border-gray-700 text-gray-300 hover:border-[#6BCA6E] hover:text-[#6BCA6E] transition"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.125 19.588 3 21l1.412-4.125L16.862 3.487Z"
                              />
                            </svg>
                          </button>


                          <button
                            onClick={async () => {
                              if (!confirm("Delete this post?")) return;
                              await http.delete(`/posts/${post._id}`);
                              setPosts((prev) => prev.filter((p) => p._id !== post._id));
                            }}
                            title="Delete post"
                            className="rounded p-2 border border-red-700/50 text-red-400 hover:border-red-500 hover:text-red-500 transition"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916"
                              />
                            </svg>
                          </button>

                        </div>
                      )}


                      <button
                        onClick={() => handleVote(post._id)}
                        disabled={voted}
                        className={`relative overflow-hidden rounded px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${voted
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                          : "bg-[#6BCA6E] text-black hover:bg-[#5abc5d] hover:shadow-[0_0_10px_rgba(107,202,110,0.4)]"
                          }`}
                      >
                        {voted ? "Locked" : "Execute Vote"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
