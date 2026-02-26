import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 group">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ea3941"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:opacity-80 transition-opacity"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M9 8h4.09c1.055 0 1.91 .895 1.91 2s-.855 2 -1.91 2c1.055 0 1.91 .895 1.91 2s-.855 2 -1.91 2h-4.09" />
        <path d="M10 12h4" />
        <path d="M10 7v10v-9" />
        <path d="M13 7v1" />
        <path d="M13 16v1" />
      </svg>

      <span className="text-[#eaecef] font-semibold text-[15px] tracking-tight group-hover:opacity-80 transition-opacity">
        Backpack
      </span>
    </Link>
  );
}
