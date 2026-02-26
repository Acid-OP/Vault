import Link from "next/link";

export default function NavLinks() {
  return (
    <div className="flex items-center space-x-6 ml-12">
      <Link
        href="/trade/CR7_USD"
        className="text-[12px] font-medium text-[#848e9c] hover:text-[#eaecef] transition-colors duration-200 cursor-pointer"
      >
        Trade
      </Link>
      <Link
        href="/markets"
        className="text-[12px] font-medium text-[#848e9c] hover:text-[#eaecef] transition-colors duration-200 cursor-pointer"
      >
        Markets
      </Link>
      <Link
        href="/leaderboard"
        className="text-[12px] font-medium text-[#848e9c] hover:text-[#eaecef] transition-colors duration-200 cursor-pointer"
      >
        Leaderboard
      </Link>
    </div>
  );
}
