export default function Input({ label, type = "text", id, name, value, onChange, placeholder, required = false, className = "", error }) {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">
                    {label} {required && <span className="text-[#6BCA6E]">*</span>}
                </label>
            )}
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`w-full bg-[#0A0A0A] border border-gray-800 text-white px-4 py-3 rounded focus:outline-none focus:border-[#6BCA6E] focus:ring-1 focus:ring-[#6BCA6E] transition-all placeholder-gray-600 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
