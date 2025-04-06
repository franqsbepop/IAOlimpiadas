import { Link } from "wouter";

export function Logo() {
  return (
    <Link href="/">
      <div className="logo-container cursor-pointer">
        <div className="logo-wrapper flex items-center">
          <div className="logo-text">
            <div className="logo-title text-2xl font-bold text-gray-800 tracking-tight">
              IA<span className="text-primary font-black">Olimpíadas</span>
            </div>
            <div className="logo-subtitle text-xs font-medium text-primary tracking-widest uppercase">
              Portugal 2026
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}