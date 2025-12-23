import { useEffect, useMemo, useState } from "react";
import { http } from "../api/http";
import LoadingOverlay from "../shared/components/LoadingOverlay";
import Button from "../shared/components/Button";

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

    const { leftPercent, rightPercent } = useMemo(() => {
        const total = leftVotes + rightVotes;
        const lp = total === 0 ? 0 : Math.round((leftVotes / total) * 100);
        return { leftPercent: lp, rightPercent: 100 - lp };
    }, [leftVotes, rightVotes]);

    async function vote(postId) {
        // Show loading briefly for effect
        setLoading(true);
        try {
            const res = await http.post(`/posts/${postId}/vote`);
            const updated = res.data.post || res.data;

            if (left && updated._id === left._id) setLeft(updated);
            if (right && updated._id === right._id) setRight(updated);

            setVoted(true);

            setAnimatedSide(
                left && postId === left._id ? "left" : "right"
            );

            // after 0.5 remove animation class, keep voted state
            setTimeout(() => setAnimatedSide(null), 500);

        } catch (e) {
            const msg = e.response?.data?.message || e.message;
            if (msg.toLowerCase().includes("already voted")) {
                // Refresh data to show current state
                const postsRes = await http.get("/posts");
                const all = postsRes.data.posts || [];
                const newLeft = all.find(p => p._id === left._id);
                const newRight = all.find(p => p._id === right._id);
                if (newLeft) setLeft(newLeft);
                if (newRight) setRight(newRight);
                setVoted(true);
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    }

    if (error) return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-red-500 border border-red-500/50 p-6 rounded bg-red-900/10 text-center max-w-md">
                <h2 className="text-xl font-bold mb-2">SYSTEM ERROR</h2>
                {error}
                <div className="mt-4">
                    <Button onClick={() => window.location.reload()} variant="danger">Reload System</Button>
                </div>
            </div>
        </div>
    );

    if (!left || !right) return <LoadingOverlay visible={true} />;

    return (
        <div className="max-w-6xl mx-auto space-y-8 py-10 px-4 min-h-[80vh] flex flex-col justify-center">
            <LoadingOverlay visible={loading && !left} />
            {/* Note: We keep content visible when voting (loading=true) but show overlay if initial load */}

            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-white tracking-widest uppercase">
                    Blog Battle
                    <span className="text-[#6BCA6E]">.exe</span>
                </h1>
                <p className="text-gray-400 font-mono text-sm max-w-lg mx-auto">
                    Compare two data streams. Execute your choice. Analyze consensus.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative items-stretch">
                {/* VS Badge */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex h-16 w-16 items-center justify-center rounded-full bg-black border-2 border-[#6BCA6E] text-[#6BCA6E] font-bold text-xl shadow-[0_0_20px_rgba(107,202,110,0.5)] z-20">
                    VS
                </div>

                {/* LEFT CARD */}
                <BattleCard
                    post={left}
                    side="left"
                    voted={voted}
                    isWinner={isLeftWinner}
                    animated={animatedSide === "left"}
                    percent={leftPercent}
                    rawVotes={leftVotes}
                    onVote={() => vote(left._id)}
                />

                {/* RIGHT CARD */}
                <BattleCard
                    post={right}
                    side="right"
                    voted={voted}
                    isWinner={isRightWinner}
                    animated={animatedSide === "right"}
                    percent={rightPercent}
                    rawVotes={rightVotes}
                    onVote={() => vote(right._id)}
                />
            </div>

            <div className="flex justify-center gap-4 pt-8">
                <Button onClick={loadBattle}>
                    Next_Battle (Process)
                </Button>

                <Button onClick={() => window.location.reload()} variant="outline">
                    Reload_System
                </Button>
            </div>
        </div>
    );
}

function BattleCard({ post, side, voted, isWinner, animated, percent, rawVotes, onVote }) {
    return (
        <div
            className={`relative flex flex-col justify-between rounded-xl bg-[#0a0a0a] border p-6 transition-all duration-500
            ${voted && isWinner ? "border-[#6BCA6E] shadow-[0_0_20px_rgba(107,202,110,0.2)] ring-1 ring-[#6BCA6E]/50" : "border-gray-800 hover:border-[#6BCA6E]/30"}
            ${animated ? "scale-[1.02] shadow-[0_0_40px_rgba(107,202,110,0.4)]" : ""}
            `}
        >
            {/* Victory Particle Effect */}
            {voted && isWinner && (
                <div className="absolute inset-0 z-0 overflow-hidden rounded-xl pointer-events-none">
                    <div className="absolute top-0 left-1/2 h-full w-[200%] -translate-x-1/2 bg-[radial-gradient(circle,rgba(107,202,110,0.08)_0%,transparent_70%)] animate-pulse" />
                </div>
            )}

            <div className="relative z-10 space-y-4 flex-grow">
                <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-gray-500 uppercase">ID_{side}::{post._id.slice(-4)}</span>
                    {voted && isWinner && (
                        <span className="inline-block px-2 py-0.5 text-xs font-bold bg-[#6BCA6E] text-black rounded animate-pulse">
                            VICTORY
                        </span>
                    )}
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{post.title}</h2>
                    <div className="text-xs text-gray-500 font-mono">
                        AUTHOR: {post.author?.name || "UNKNOWN_ENTITY"}
                    </div>
                </div>

                <div className="text-gray-300 leading-relaxed border-l-2 border-gray-800 pl-4 py-2 text-sm">
                    {post.content}
                </div>
            </div>

            <div className="relative z-10 mt-6 pt-6 border-t border-gray-800">
                {!voted ? (
                    <Button onClick={onVote} variant="outline" className="w-full text-center">
                        Execute Vote_{side === "left" ? "A" : "B"}
                    </Button>
                ) : (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                            <span className={isWinner ? "text-[#6BCA6E]" : "text-gray-500"}>CONSENSUS</span>
                            <span className={isWinner ? "text-[#6BCA6E]" : "text-white"}>{percent}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                            <div
                                className={`h-full transition-all duration-1000 ease-out ${isWinner ? "bg-[#6BCA6E]" : "bg-gray-600"}`}
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                        <div className="text-right text-xs text-gray-500 font-mono">RAW_COUNT: {rawVotes}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
