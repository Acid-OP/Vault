import Logo from './Logo';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';
import AuthButtons from './AuthButtons';

export default function Navbar() {
  return (
    <nav className="shrink-0">
      <div className="w-full px-4 bg-[#0e0f14] border-b border-[#1a1b24]">
        <div className="flex items-center h-12">
          <Logo />
          <NavLinks />
          <SearchBar />
          <AuthButtons />
        </div>
      </div>
    </nav>
  );
}
