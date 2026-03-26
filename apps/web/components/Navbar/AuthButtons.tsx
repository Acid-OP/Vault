import Link from "next/link";

export default function AuthButtons() {
  return (
    <div className="flex items-center space-x-3 ml-auto">
      <Link
        href="/signin"
        className="px-4 py-1.5 rounded-lg text-[12px] font-medium text-[#848e9c] hover:text-[#eaecef] transition-colors duration-200"
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className="px-4 py-1.5 rounded-lg text-[12px] font-medium bg-[#eaecef] text-[#0e0f14] hover:bg-white transition-colors duration-200"
      >
        Get Started
      </Link>
    </div>
  );
}
