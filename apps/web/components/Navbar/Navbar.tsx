import Logo from "./Logo";
import NavLinks from "./NavLinks";
import SearchBar from "./SearchBar";
import AuthButtons from "./AuthButtons";

export default function Navbar() {
  return (
    <nav className="shrink-0 sticky top-0 z-50">
      <div className="w-full px-6 bg-[#0e0f14]/80 backdrop-blur-xl border-b border-[rgba(42,46,57,0.2)]">
        <div className="flex items-center h-14 max-w-[1400px] mx-auto">
          <Logo />
          <NavLinks />
          <SearchBar />
          <AuthButtons />
        </div>
      </div>
    </nav>
  );
}
