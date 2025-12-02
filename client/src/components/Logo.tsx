interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  const handleClick = () => {
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleClick}
      className={`font-black tracking-tighter hover:opacity-80 active:scale-95 transition-all ${className}`}
    >
      Skore.
    </button>
  );
}
