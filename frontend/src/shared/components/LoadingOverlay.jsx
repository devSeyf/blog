export default function LoadingOverlay({ visible }) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-500">
            <div className="relative flex flex-col items-center gap-4">
                {/* Simple Green Spinner */}
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#6BCA6E]/30 border-t-[#6BCA6E]"></div>
                <div className="animate-pulse text-[#6BCA6E] font-mono text-sm tracking-widest">
                    Just a moment 
                </div>
            </div>
        </div>
    );
}
