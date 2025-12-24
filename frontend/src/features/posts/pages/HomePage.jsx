import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { http } from "../../../api/http";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import PostCard from "../components/PostCard";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasMore: false
  });

  const user = useSelector((s) => s.auth.user);
  const token = useSelector((s) => s.auth.token);

  const location = useLocation();
  const navigate = useNavigate();

  const refreshKey = location.state?.refresh;
  const POSTS_PER_PAGE = 10;

  useEffect(() => {
    let timerId;
    let isMounted = true;

    const fetchPosts = async () => {
      setError(null);

      timerId = setTimeout(() => {
        if (isMounted) setLoading(true);
      }, 250);

      try {
        const timings = {
          start: performance.now(),
          requestSent: 0,
          responseReceived: 0,
          renderComplete: 0
        };

        timings.requestSent = performance.now();
        console.log('🚀 Request sent at:', Math.round(timings.requestSent - timings.start), 'ms');

        const res = await http.get(`/posts?page=${page}&limit=${POSTS_PER_PAGE}`);

        timings.responseReceived = performance.now();
        console.log('📦 Response received at:', Math.round(timings.responseReceived - timings.start), 'ms');
        console.log('⏱️  TTFB:', Math.round(timings.responseReceived - timings.requestSent), 'ms');
        console.log('📊 Response size:', (JSON.stringify(res.data).length / 1024).toFixed(2), 'KB');
        console.log('📝 Number of posts:', res.data.posts?.length || 0);
        console.log('📄 Page:', res.data.pagination?.currentPage, 'of', res.data.pagination?.totalPages);

        if (isMounted) {
          setPosts(res.data.posts || []);
          setPagination(res.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalPosts: 0,
            hasMore: false
          });
        }

        // Measure render time
        requestAnimationFrame(() => {
          timings.renderComplete = performance.now();
          console.log('🎨 Render complete at:', Math.round(timings.renderComplete - timings.start), 'ms');
          console.log('📊 Total time:', Math.round(timings.renderComplete - timings.start), 'ms');
        });
      } catch (e) {
        console.error('❌ Error:', e);
        if (isMounted) setError(e.response?.data?.message || e.message);
      } finally {
        clearTimeout(timerId);
        if (isMounted) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [page, refreshKey]);

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

  const handleDelete = async (postId) => {
    if (!confirm("Delete this post?")) return;
    try {
      await http.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
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

      <div className={`w-full max-w-3xl flex-col items-center py-10 px-4 ${loading ? "opacity-0" : "opacity-100"}`}>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white border-l-4 border-[#6BCA6E] pl-4">
            All Posts
          </h2>
          {pagination.totalPosts > 0 && (
            <span className="text-sm text-gray-500">
              {pagination.totalPosts} total posts
            </span>
          )}
        </div>

        {posts.length === 0 && !loading && (
          <div className="w-full rounded border border-dashed border-gray-700 p-8 text-center text-gray-500">
            No signal detected.
          </div>
        )}

        <div className="w-full space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              user={user}
              token={token}
              onVote={handleVote}
              onEdit={(id) => navigate(`/posts/${id}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-[#6BCA6E] text-black rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5abc5d] transition"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="px-4 py-2 text-white font-mono">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            </div>

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!pagination.hasMore}
              className="px-4 py-2 bg-[#6BCA6E] text-black rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5abc5d] transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
