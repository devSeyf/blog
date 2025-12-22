import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/auth/authSlice";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { status, error, user } = useSelector((state) => state.auth);
    
    
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
            <div>
                <label>
                    Email:
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
            </div>

            <div>
                <label>
                    Password:
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
            </div>{error && <p className="text-red-600">{error}</p>}

            <button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Logging in..." : "Login"}
            </button>



        </form>
    )
}