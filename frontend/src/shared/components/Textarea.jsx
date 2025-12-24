import { forwardRef } from "react";

const Textarea = forwardRef(({ label, id, className = "", ...props }, ref) => (
  <div className="space-y-2">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
    )}
    <textarea
      id={id}
      ref={ref}
      className={`w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#6BCA6E] focus:border-transparent resize-vertical transition-all ${className}`}
      {...props}
    />
  </div>
));

Textarea.displayName = "Textarea";
export default Textarea;
