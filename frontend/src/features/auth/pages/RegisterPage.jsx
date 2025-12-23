import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../authSlice"; // Auto-login often uses same action
import { http } from "../../../api/http";
import LoadingOverlay from "../../../shared/components/LoadingOverlay";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  let timerId;

  try {
     
    timerId = setTimeout(() => {
      setLoading(true);
    }, 250);

    const resultAction = await dispatch(
      register({ name, email, password })
    );

    if (register.fulfilled.match(resultAction)) {
      navigate("/");
    } else {
      setError(resultAction.payload || "Registration failed");
    }
  } catch (err) {
    setError("An unexpected error occurred");
  } finally {
    clearTimeout(timerId);
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <LoadingOverlay visible={loading} />

      <div className="w-full max-w-md space-y-8 rounded-lg border border-[#6BCA6E]/20 bg-[#0a0a0a] p-8 shadow-[0_0_30px_rgba(107,202,110,0.05)] backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#6BCA6E] bg-black text-[#6BCA6E] shadow-[0_0_15px_rgba(107,202,110,0.5)]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.007v.008h-.007V16.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">NEW_USER_PROTOCOL</h2>
          <p className="mt-2 text-sm text-gray-400">
            Establish a new secure identity.
          </p>
        </div>

        {error && (
          <div className="rounded border border-red-500/50 bg-red-900/10 p-4 text-sm text-red-500">
            ERROR: {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Identity Name"
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
            <Input
              label="Email Address"
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
            <Input
              label="Set Password"
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full">
            Establish Identity
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already verified?{" "}
          <Link to="/login" className="font-semibold text-[#6BCA6E] hover:underline">
            Access Terminal
          </Link>
        </p>
      </div>
    </div>
  );
}
