import { useState } from "react";
import { useSelector } from "react-redux";
import { http } from "../api/http";

export default function ProfilePage() {
  const { user, token } = useSelector((s) => s.auth);
  const [serverUser, setServerUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMe = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await http.get("/me");  
      setServerUser(res.data.user);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Profile / Test</h1>

      <div className="border p-4 rounded space-y-2">
        <h2 className="font-semibold">Redux Auth State</h2>
        <div><b>User:</b> {user ? user.email : "null"}</div>
        <div><b>Token:</b> {token ? token.slice(0, 20) + "..." : "null"}</div>
      </div>

      <button
        onClick={fetchMe}
        className="bg-black text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch /api/me"}
      </button>

      {error && <div className="text-red-600">Error: {error}</div>}

      {serverUser && (
        <div className="border p-4 rounded space-y-2">
          <h2 className="font-semibold">Server Response</h2>
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(serverUser, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
