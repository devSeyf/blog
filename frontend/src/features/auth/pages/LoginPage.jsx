import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../authSlice";
import { http } from "../../../api/http";
import { http } from "../../../api/http";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        let timerId = null;

        try {

            timerId = setTimeout(() => {
                setLoading(true);
            }, 250);

            const resultAction = await dispatch(login({ email, password }));

            if (login.fulfilled.match(resultAction)) {
                navigate("/");
            } else {
                setError(resultAction.payload || "Authentication failed");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            if (timerId) clearTimeout(timerId);
            setLoading(false);
        }
    };


    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">

            <div className="w-full max-w-md space-y-8 rounded-lg border border-[#6BCA6E]/20 bg-[#0a0a0a] p-8 shadow-[0_0_30px_rgba(107,202,110,0.05)] backdrop-blur-sm">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#6BCA6E] bg-black text-[#6BCA6E] shadow-[0_0_15px_rgba(107,202,110,0.5)]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">ACCESS_TERMINAL</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Authorized personnel only. Please verify credentials.
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
                            label="Email Address"
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                        />
                        <Input
                            label="Password"
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Authenticate
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500">
                    New user?{" "}
                    <Link to="/register" className="font-semibold text-[#6BCA6E] hover:underline">
                        Initialize Protocols
                    </Link>
                </p>
            </div>
        </div>
    );
}