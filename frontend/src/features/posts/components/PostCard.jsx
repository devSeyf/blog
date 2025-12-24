import { memo } from "react";
import { optimizeCloudinaryUrl } from "../../../shared/utils/imageUtils";

const PostCard = memo(({ post, user, token, onVote, onEdit, onDelete }) => {
    const isOwner = user && String(post.author?._id || post.author) === String(user._id || user.id);
    const voted = user && (post.voters || []).some((v) => String(v) === String(user._id || user.id));

    return (
        <div className="group relative overflow-hidden rounded-xl bg-[#0a0a0a] border border-gray-800 p-6 transition-all duration-300 hover:border-[#6BCA6E]/50 hover:shadow-[0_10px_30px_rgba(107,202,110,0.1)] hover:-translate-y-1">
            <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-[#6BCA6E]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {post.imageUrl && (
                <div className="mb-4 overflow-hidden rounded border border-gray-800">
                    <img
                        src={optimizeCloudinaryUrl(post.imageUrl, { width: 800, quality: 'auto' })}
                        alt={post.title}
                        className="h-48 w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            )}

            <div className="mb-2 flex items-center justify-between">
                {post.category && (
                    <span className="rounded bg-[#6BCA6E]/10 px-2 py-0.5 text-xs font-medium text-[#6BCA6E] border border-[#6BCA6E]/20">
                        {post.category}
                    </span>
                )}
                <span className="font-mono text-xs text-gray-500">
                    ID: {post._id.slice(-6).toUpperCase()}
                </span>
            </div>

            <h3 className="mb-2 text-xl font-bold text-white group-hover:text-[#6BCA6E] transition-colors">
                {post.title}
            </h3>

            <p className="mb-4 text-gray-400 line-clamp-3">{post.content}</p>

            <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-4">
                <div className="flex flex-col text-xs text-gray-500">
                    <span>
                        OP:{" "}
                        <span className="text-gray-300">
                            {post.author?.name || "Unknown"}
                        </span>
                    </span>
                    <span>
                        Votes:{" "}
                        <span className="text-[#6BCA6E]">
                            {post.votesCount || 0}
                        </span>
                    </span>
                </div>

                {!token ? (
                    <span className="text-xs text-gray-600 italic">
                        Login to decrypt
                    </span>
                ) : (
                    <>
                        {token && isOwner && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(post._id)}
                                    title="Edit post"
                                    className="rounded p-2 border border-gray-700 text-gray-300 hover:border-[#6BCA6E] hover:text-[#6BCA6E] transition"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.125 19.588 3 21l1.412-4.125L16.862 3.487Z"
                                        />
                                    </svg>
                                </button>

                                <button
                                    onClick={() => onDelete(post._id)}
                                    title="Delete post"
                                    className="rounded p-2 border border-red-700/50 text-red-400 hover:border-red-500 hover:text-red-500 transition"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => onVote(post._id)}
                            disabled={voted}
                            className={`relative overflow-hidden rounded px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${voted
                                    ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                                    : "bg-[#6BCA6E] text-black hover:bg-[#5abc5d] hover:shadow-[0_0_10px_rgba(107,202,110,0.4)]"
                                }`}
                        >
                            {voted ? "Locked" : "Execute Vote"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison: only re-render if post data changed
    return (
        prevProps.post._id === nextProps.post._id &&
        prevProps.post.votesCount === nextProps.post.votesCount &&
        prevProps.post.title === nextProps.post.title &&
        prevProps.post.content === nextProps.post.content &&
        prevProps.user?._id === nextProps.user?._id &&
        prevProps.token === nextProps.token
    );
});

PostCard.displayName = 'PostCard';

export default PostCard;
