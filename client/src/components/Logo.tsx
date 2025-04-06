import { Link } from "wouter";

export function Logo() {
  return (
    <Link href="/">
      <div className="logo-container cursor-pointer">
        <div className="logo-wrapper flex items-center">
          <div className="logo-mark relative">
            <div className="logo-brain w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md overflow-hidden">
              <div className="logo-circuits absolute inset-0 opacity-20">
                <div className="circuit-line-1 absolute top-2 left-2 w-8 h-1 bg-white rounded-full"></div>
                <div className="circuit-line-2 absolute top-5 left-3 w-5 h-1 bg-white rounded-full"></div>
                <div className="circuit-line-3 absolute top-8 left-1 w-6 h-1 bg-white rounded-full"></div>
                <div className="circuit-dot-1 absolute top-1 right-2 w-2 h-2 bg-white rounded-full"></div>
                <div className="circuit-dot-2 absolute bottom-2 right-3 w-2 h-2 bg-white rounded-full"></div>
                <div className="circuit-dot-3 absolute bottom-3 left-2 w-1 h-1 bg-white rounded-full"></div>
              </div>
              <div className="logo-icon relative z-10 text-white flex flex-col items-center justify-center">
                <span className="text-2xl font-bold tracking-tighter">AI</span>
                <span className="text-xs font-medium tracking-wider">26</span>
              </div>
            </div>
            <div className="logo-spark absolute -top-1 -right-1 w-3 h-3 bg-blue-200 rounded-full animate-pulse"></div>
            <div className="logo-glow absolute inset-0 bg-primary/20 rounded-lg filter blur-xl opacity-50"></div>
          </div>
          <div className="logo-text ml-3">
            <div className="logo-title text-lg font-semibold leading-tight tracking-tight text-gray-800">
              Olimpíadas<span className="text-primary">IA</span>
            </div>
            <div className="logo-subtitle text-xs font-medium text-gray-500 tracking-wider">
              PORTUGAL
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}