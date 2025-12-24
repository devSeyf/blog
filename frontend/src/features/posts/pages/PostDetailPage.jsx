import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { http } from "../../../api/http";
import Button from "../../../shared/components/Button";

export default function PostDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await http.get(`/posts/${id}`);
                setPost(res.data.post);
            } catch (e) {
                setError(e.response?.data?.message || "Failed to load post");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="text-[#6BCA6E] animate-pulse font-mono uppercase tracking-[0.2em]">
                    Accessing_Archive...
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
                <div className="rounded border border-red-500/50 bg-red-900/10 p-8 text-center text-red-500 max-w-md">
                    <h2 className="mb-4 text-2xl font-bold font-mono">CORE_FAILURE</h2>
                    <p className="mb-6">{error || "Transmission data corrupted or not found."}</p>
                    <Button onClick={() => navigate("/")}>Return to Home</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white py-10 px-4 flex flex-col items-center">
            <article className="w-full max-w-4xl bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {/* Header/Meta */}
                <div className="p-6 md:p-10 border-b border-gray-800 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        {post.category && (
                            <span className="rounded bg-[#6BCA6E]/10 px-3 py-1 text-sm font-medium text-[#6BCA6E] border border-[#6BCA6E]/20">
                                {post.category.toUpperCase()}
                            </span>
                        )}
                        <span className="font-mono text-xs text-gray-500 tracking-wider">
                            ID: {post._id.toUpperCase()}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 group-hover:text-[#6BCA6E] transition-colors">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-6 text-sm font-mono text-gray-500">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-600 mb-0.5">Originator</span>
                            <span className="text-gray-300">{post.author?.name || "Anonymous_User"}</span>
                        </div>
                        <div className="h-8 w-px bg-gray-800" />
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-600 mb-0.5">Synchronized</span>
                            <span className="text-gray-300">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="h-8 w-px bg-gray-800" />
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-600 mb-0.5">Endorsements</span>
                            <span className="text-[#6BCA6E] font-bold">{post.votesCount || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                {post.imageUrl && (
                    <div className="w-full border-b border-gray-800 overflow-hidden bg-black">
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-auto max-h-[600px] object-contain opacity-90"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="p-6 md:p-12">
                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap font-sans">
                            {post.content}
                        </p>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex gap-4">
                            <Button variant="secondary" onClick={() => navigate(-1)}>
                                ← Back to Archive
                            </Button>
                        </div>
                        <div className="font-mono text-[10px] text-gray-600 italic">
                            END_OF_TRANSMISSION // ENCRYPTED_DATA_772-X
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
