function Button({ text, onClick, variant = "primary", fullWidth = true }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold text-sm rounded-xl px-5 py-2 transition-all duration-150 active:scale-95 focus:outline-none";

  const variants = {
    primary:   "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm hover:shadow-md hover:from-teal-600 hover:to-teal-700",
    secondary: "bg-white text-teal-600 border border-teal-200 shadow-sm hover:bg-teal-50 hover:shadow-md",
    ghost:     "bg-transparent text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
    >
      {text}
    </button>
  );
}

export default Button;
