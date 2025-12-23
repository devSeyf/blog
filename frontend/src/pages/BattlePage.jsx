import { useEffect, useMemo, useState } from "react";
import { http } from "../api/http";

export default function BattlePage() {
    const [left, setLeft] = useState(null);
    const [right, setRight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [voted, setVoted] = useState(false);
    const [error, setError] = useState(null);
    const [animatedSide, setAnimatedSide] = useState(null);

    async function loadBattle() {
        setLoading(true);
        setError(null);
        setVoted(false);
        setAnimatedSide(null);
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

    const isLeftWinner = leftVotes > rightVotes;
    const isRightWinner = rightVotes > leftVotes;
    const isTie = leftVotes === rightVotes;

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

            setAnimatedSide(
                left && postId === left._id ? "left" : "right"
            );

            // after 0.5 remove
            setTimeout(() => setAnimatedSide(null), 500);

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

    if (loading) return <div className="text-[#6BCA6E] animate-pulse flex justify-center py-20">ESTABLISHING CONNECTION...</div>;
    if (error) return <div className="text-red-500 border border-red-500/50 p-4 rounded bg-red-900/10 text-center">SYSTEM ERROR: {error}</div>;
    if (!left || !right) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-8 py-10 px-4">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-white tracking-widest uppercase">
                    Blog Battle
                    <span className="text-[#6BCA6E]">.exe</span>
                </h1>
                <p className="text-gray-400 font-mono text-sm max-w-lg mx-auto">
                    Compare two data streams. Execute your choice. Analyze consensus.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
                {/* VS Badge */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex h-12 w-12 items-center justify-center rounded-full bg-black border-2 border-[#6BCA6E] text-[#6BCA6E] font-bold shadow-[0_0_20px_rgba(107,202,110,0.5)]">
                    VS
                </div>

                {/* LEFT CARD */}
                <div
                    className={`relative flex flex-col justify-between rounded-lg border bg-[#0a0a0a] p-6 transition-all duration-500 hover:shadow-[0_0_30px_rgba(107,202,110,0.1)]
                    ${voted && isLeftWinner ? "border-[#6BCA6E] shadow-[0_0_20px_rgba(107,202,110,0.3)] ring-1 ring-[#6BCA6E]" : "border-gray-800 hover:border-gray-700"}
                    ${animatedSide === "left" ? "scale-[1.02] shadow-[0_0_40px_rgba(107,202,110,0.6)]" : ""}
                    `}
                >
                    {/* Victory Particle Effect (Simple CSS) */}
                    {voted && isLeftWinner && (
                        <div className="absolute inset-0 z-0 overflow-hidden rounded-lg pointer-events-none">
                            <div className="absolute top-0 left-1/2 h-full w-[200%] -translate-x-1/2 bg-[radial-gradient(circle,rgba(107,202,110,0.1)_0%,transparent_70%)] animate-pulse" />
                        </div>
                    )}

                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="font-mono text-xs text-gray-500">ID_LEFT::X01</span>
                            {voted && isLeftWinner && (
                                <span className="inline-block px-2 py-0.5 text-xs font-bold bg-[#6BCA6E] text-black rounded animate-pulse">
                                    VICTORY
                                </span>
                            )}
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-[#6BCA6E] transition-colors">{left.title}</h2>
                            <div className="text-xs text-gray-500 font-mono">
                                AUTHOR: {left.author?.name || "UNKNOWN_ENTITY"}
                            </div>
                        </div>

                        <p className="text-gray-300 leading-relaxed min-h-[100px] border-l-2 border-gray-800 pl-4 py-2">
                            {left.content}
                        </p>
                    </div>

                    <div className="relative z-10 mt-6 pt-6 border-t border-gray-800">
                        {!voted ? (
                            <button
                                onClick={() => vote(left._id)}
                                className="w-full rounded border border-[#6BCA6E] py-3 text-sm font-bold uppercase tracking-widest text-[#6BCA6E] transition-all hover:bg-[#6BCA6E] hover:text-black hover:shadow-[0_0_15px_rgba(107,202,110,0.4)]"
                            >
                                Execute Vote_A
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className={isLeftWinner ? "text-[#6BCA6E]" : "text-gray-500"}>CONSENSUS</span>
                                    <span className={isLeftWinner ? "text-[#6BCA6E]" : "text-white"}>{leftPercent}%</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-out ${isLeftWinner ? "bg-[#6BCA6E]" : "bg-gray-600"}`}
                                        style={{ width: `${leftPercent}%` }}
                                    />
                                </div>
                                <div className="text-right text-xs text-gray-500 font-mono">RAW_COUNT: {leftVotes}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT CARD */}
                <div
                    className={`relative flex flex-col justify-between rounded-lg border bg-[#0a0a0a] p-6 transition-all duration-500 hover:shadow-[0_0_30px_rgba(107,202,110,0.1)]
                    ${voted && isRightWinner ? "border-[#6BCA6E] shadow-[0_0_20px_rgba(107,202,110,0.3)] ring-1 ring-[#6BCA6E]" : "border-gray-800 hover:border-gray-700"}
                    ${animatedSide === "right" ? "scale-[1.02] shadow-[0_0_40px_rgba(107,202,110,0.6)]" : ""}
                    `}
                >
                    {/* Victory Effect */}
                    {voted && isRightWinner && (
                        <div className="absolute inset-0 z-0 overflow-hidden rounded-lg pointer-events-none">
                            <div className="absolute top-0 left-1/2 h-full w-[200%] -translate-x-1/2 bg-[radial-gradient(circle,rgba(107,202,110,0.1)_0%,transparent_70%)] animate-pulse" />
                        </div>
                    )}

                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="font-mono text-xs text-gray-500">ID_RIGHT::X02</span>
                            {voted && isRightWinner && (
                                <span className="inline-block px-2 py-0.5 text-xs font-bold bg-[#6BCA6E] text-black rounded animate-pulse">
                                    VICTORY
                                </span>
                            )}
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-[#6BCA6E] transition-colors">{right.title}</h2>
                            <div className="text-xs text-gray-500 font-mono">
                                AUTHOR: {right.author?.name || "UNKNOWN_ENTITY"}
                            </div>
                        </div>

                        <p className="text-gray-300 leading-relaxed min-h-[100px] border-l-2 border-gray-800 pl-4 py-2">
                            {right.content}
                        </p>
                    </div>

                    <div className="relative z-10 mt-6 pt-6 border-t border-gray-800">
                        {!voted ? (
                            <button
                                onClick={() => vote(right._id)}
                                className="w-full rounded border border-[#6BCA6E] py-3 text-sm font-bold uppercase tracking-widest text-[#6BCA6E] transition-all hover:bg-[#6BCA6E] hover:text-black hover:shadow-[0_0_15px_rgba(107,202,110,0.4)]"
                            >
                                Execute Vote_B
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className={isRightWinner ? "text-[#6BCA6E]" : "text-gray-500"}>CONSENSUS</span>
                                    <span className={isRightWinner ? "text-[#6BCA6E]" : "text-white"}>{rightPercent}%</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-out ${isRightWinner ? "bg-[#6BCA6E]" : "bg-gray-600"}`}
                                        style={{ width: `${rightPercent}%` }}
                                    />
                                </div>
                                <div className="text-right text-xs text-gray-500 font-mono">RAW_COUNT: {rightVotes}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-4 pt-8">
                <button
                    onClick={loadBattle}
                    className="rounded bg-[#6BCA6E] px-8 py-3 text-sm font-bold uppercase text-black shadow-lg transition-transform hover:scale-105 hover:bg-[#5abc5d]"
                >
                    Next_Battle (Process)
                </button>

                <button
                    onClick={() => window.location.reload()}
                    className="rounded border border-gray-700 px-6 py-3 text-sm font-bold uppercase text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
                >
                    Reload_System
                </button>
            </div>
        </div>
    );
}
