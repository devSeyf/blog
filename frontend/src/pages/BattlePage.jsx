import { useEffect, useMemo, useState } from "react";
import { http } from "../api/http";

export default function BattlePage() {
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState(null);

  async function loadBattle() {
    setLoading(true);
    setError(null);
    setVoted(false);

    try {
 
      const res = await http.get("/posts");
      const all = res.data.posts || [];

      if (all.length < 2) {
        setError("Need at least 2 posts to start a battle.");
        setLeft(null);
        setRight(null);
        return;
      }

      const a = all[Math.floor(Math.random() * all.length)];
      let b = all[Math.floor(Math.random() * all.length)];
      while (b._id === a._id) b = all[Math.floor(Math.random() * all.length)];

      setLeft(a);
      setRight(b);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBattle();
  }, []);

  const leftVotes = left?.votesCount ?? 0;
  const rightVotes = right?.votesCount ?? 0;

  const { leftPercent, rightPercent } = useMemo(() => {
    const total = leftVotes + rightVotes;
    const lp = total === 0 ? 0 : Math.round((leftVotes / total) * 100);
    return { leftPercent: lp, rightPercent: 100 - lp };
  }, [leftVotes, rightVotes]);

async function vote(postId) {
  try {
    const res = await http.post(`/posts/${postId}/vote`);
    const updated = res.data.post || res.data;

    if (left && updated._id === left._id) setLeft(updated);
    if (right && updated._id === right._id) setRight(updated);

    setVoted(true);
  } catch (e) {
    const msg = e.response?.data?.message || e.message;

    
    if (msg.toLowerCase().includes("already voted")) {
     
      const postsRes = await http.get("/posts");
      const all = postsRes.data.posts || [];

      const newLeft = all.find(p => p._id === left._id);
      const newRight = all.find(p => p._id === right._id);

      if (newLeft) setLeft(newLeft);
      if (newRight) setRight(newRight);

      setVoted(true);  
      return;
    }

    setError(msg);
  }
}

  if (loading) return <div>Loading battle...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!left || !right) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Blog Battle</h1>
      <p className="text-gray-600">
        Vote for the better post. After voting, you’ll see the % result.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="border p-4 rounded space-y-3">
          <div className="text-sm text-gray-500">By {left.author?.name || "Unknown"}</div>
          <h2 className="text-xl font-semibold">{left.title}</h2>
          <p>{left.content}</p>

          <div className="text-sm text-gray-600">Votes: {leftVotes}</div>

          {!voted ? (
            <button
              onClick={() => vote(left._id)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Vote Left
            </button>
          ) : (
            <div className="font-semibold">Left: {leftPercent}%</div>
          )}
        </div>

        {/* RIGHT */}
        <div className="border p-4 rounded space-y-3">
          <div className="text-sm text-gray-500">By {right.author?.name || "Unknown"}</div>
          <h2 className="text-xl font-semibold">{right.title}</h2>
          <p>{right.content}</p>

          <div className="text-sm text-gray-600">Votes: {rightVotes}</div>

          {!voted ? (
            <button
              onClick={() => vote(right._id)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Vote Right
            </button>
          ) : (
            <div className="font-semibold">Right: {rightPercent}%</div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={loadBattle}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Next Battle
        </button>

        <button
          onClick={() => window.location.reload()}
          className="border px-4 py-2 rounded"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
