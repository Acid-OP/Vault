export default function SearchBar() {
  return (
    <div className="w-56 ml-16">
      <div className="relative">
        <input
          type="text"
          placeholder="Search markets"
          className="w-full bg-[#13141c] text-[#eaecef] placeholder:text-[#3d4354] rounded-md px-3 py-1.5 pl-8 text-[11px] border border-[rgba(42,46,57,0.2)] focus:outline-none focus:border-[rgba(42,46,57,0.5)] transition-colors"
        />
        <svg
          className="w-3.5 h-3.5 text-[#3d4354] absolute left-2.5 top-[7px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}
