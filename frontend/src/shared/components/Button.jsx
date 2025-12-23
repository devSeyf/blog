export default function Button({ children, onClick, type = "button", variant = "primary", className = "", disabled = false, ...props }) {

    const baseStyles = "relative overflow-hidden rounded px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black";

    const variants = {
        primary: "bg-[#6BCA6E] text-black hover:bg-[#5abc5d] hover:shadow-[0_0_15px_rgba(107,202,110,0.4)] focus:ring-[#6BCA6E]",
        outline: "border border-[#6BCA6E] text-[#6BCA6E] hover:bg-[#6BCA6E] hover:text-black hover:shadow-[0_0_15px_rgba(107,202,110,0.4)] focus:ring-[#6BCA6E]",
        danger: "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] focus:ring-red-500",
        secondary: "bg-gray-800 text-gray-300 hover:bg-gray-700 focus:ring-gray-500"
    };

    const disabledStyles = "opacity-50 cursor-not-allowed grayscale pointer-events-none";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${disabled ? disabledStyles : ""} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
