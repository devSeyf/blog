import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { http } from "../api/http";

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPosts: 0, totalVotes: 0 });

  useEffect(() => {
    if (!user || !token) return;

    const fetchUserPosts = async () => {
      try {
        const res = await http.get(`/posts`);
        const allPosts = res.data.posts || [];
        // Filter posts by current user ID
        const myPosts = allPosts.filter(
          (p) =>
            p.author?._id === user._id ||
            p.author?.id === user._id ||
            p.author === user._id
        );

        setUserPosts(myPosts);

        // Calculate stats
        const votes = myPosts.reduce((acc, curr) => acc + (curr.votesCount || 0), 0);
        setStats({ totalPosts: myPosts.length, totalVotes: votes });
      } catch (e) {
        console.error("Failed to fetch user posts", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user, token]);

  if (!user) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-gray-500">
        <p>ACCESS DENIED: Please login to view profile.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto py-10 px-4">
      {/* User Info Card */}
      <div className="w-full rounded-lg border border-[#6BCA6E]/20 bg-[#0a0a0a] p-8 mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(107,202,110,0.05)]">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Placeholder */}
          <div className="relative group">
            <div className="h-32 w-32 rounded-full border-2 border-[#6BCA6E] bg-gray-900 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(107,202,110,0.3)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(107,202,110,0.6)]">
              <span className="text-4xl font-bold text-[#6BCA6E]">{user.name?.charAt(0).toUpperCase() || "U"}</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-[#6BCA6E]/10 animate-pulse-green opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
            <p className="text-gray-400 font-mono text-sm mb-4">
              {user.email} <br />
              <span className="text-[#6BCA6E]">Role: APPLICANT // ID: {user._id?.slice(-6).toUpperCase()}</span>
            </p>
            <p className="text-gray-300 max-w-lg mx-auto md:mx-0">
              Full Stack Developer passionate about building secure and scalable systems.
              Exploring the digital frontier.
            </p>
          </div>

          {/* Edit Button */}
          <div>
            <button className="rounded border border-[#6BCA6E] px-6 py-2 text-sm font-bold text-[#6BCA6E] transition-all hover:bg-[#6BCA6E] hover:text-black hover:shadow-[0_0_15px_rgba(107,202,110,0.4)]">
              EDIT_PROFILE
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-800 pt-8 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#6BCA6E]">{stats.totalPosts}</div>
            <div className="text-xs uppercase tracking-wider text-gray-500">Global Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#6BCA6E]">{stats.totalVotes}</div>
            <div className="text-xs uppercase tracking-wider text-gray-500">Votes Received</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-xs uppercase tracking-wider text-gray-500">Battles Won</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">98%</div>
            <div className="text-xs uppercase tracking-wider text-gray-500">Reputation</div>
          </div>
        </div>
      </div>

      {/* User Posts Section */}
      <h2 className="w-full text-left text-xl font-bold text-white mb-6 border-l-4 border-[#6BCA6E] pl-4">
        User Transmissions
      </h2>

      {loading ? (
        <div className="text-[#6BCA6E] animate-pulse">LOADING_DATA...</div>
      ) : userPosts.length === 0 ? (
        <div className="w-full rounded border border-dashed border-gray-700 p-8 text-center text-gray-500">
          No transmissions found in archive.
        </div>
      ) : (
        <div className="grid w-full gap-6 md:grid-cols-2">
          {userPosts.map((post) => (
            <div key={post._id} className="group relative overflow-hidden rounded-lg bg-[#0a0a0a] border border-gray-800 p-6 transition-all duration-300 hover:border-[#6BCA6E] hover:shadow-[0_0_15px_rgba(107,202,110,0.1)]">
              <div className="absolute top-0 right-0 h-0 w-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-[#6BCA6E]/0 transition-all duration-300 group-hover:border-r-[#6BCA6E]" />

              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-xs text-gray-500">ID: {post._id.slice(-6).toUpperCase()}</span>
                {post.category && (
                  <span className="rounded bg-[#6BCA6E]/10 px-2 py-0.5 text-xs font-medium text-[#6BCA6E] border border-[#6BCA6E]/20">
                    {post.category}
                  </span>
                )}
              </div>

              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="w-full h-32 object-cover rounded opacity-70 mb-4 border border-gray-800" />
              )}

              <h3 className="text-lg font-bold text-white group-hover:text-[#6BCA6E] transition-colors mb-2 line-clamp-1">
                {post.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                {post.content}
              </p>

              <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-800 pt-3">
                <span>Votes: <span className="text-[#6BCA6E]">{post.votesCount || 0}</span></span>
                <button className="text-white hover:text-[#6BCA6E] transition-colors uppercase tracking-wider font-bold">
                  View_Log
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
