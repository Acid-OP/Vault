interface ButtonProps {
  variant: "outline" | "solid";
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({ variant, children, onClick }: ButtonProps) {
  const baseStyles =
    "px-3.5 py-1 rounded-md text-[11px] font-medium transition-colors duration-200 cursor-pointer";

  const variantStyles = {
    outline: "bg-[#00c176]/10 text-[#00c176] hover:bg-[#00c176]/15",
    solid: "bg-[#3b82f6]/10 text-[#3b82f6] hover:bg-[#3b82f6]/15",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {children}
    </button>
  );
}

export default function AuthButtons() {
  return (
    <div className="flex items-center space-x-2 ml-auto">
      <Button variant="outline">Sign up</Button>
      <Button variant="solid">Sign in</Button>
    </div>
  );
}
