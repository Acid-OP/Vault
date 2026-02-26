import Link from "next/link";

export default function NavLinks() {
  return (
    <div className="flex items-center space-x-6 ml-12">
      <Link
        href="/spot"
        className="text-[12px] font-medium text-[#848e9c] hover:text-[#eaecef] transition-colors duration-200 cursor-pointer"
      >
        Spot
      </Link>
      <Link
        href="/futures"
        className="text-[12px] font-medium text-[#848e9c] hover:text-[#eaecef] transition-colors duration-200 cursor-pointer"
      >
        Futures
      </Link>
      <Link
        href="/lend"
        className="text-[12px] font-medium text-[#848e9c] hover:text-[#eaecef] transition-colors duration-200 cursor-pointer"
      >
        Lend
      </Link>
      <div className="relative group">
        <button className="text-[12px] font-medium text-[#848e9c] hover:text-[#eaecef] transition-colors duration-200 cursor-pointer flex items-center space-x-0.5">
          <span>More</span>
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
