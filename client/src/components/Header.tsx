import { Link, useLocation } from "wouter";
import { useContext, useState } from "react";
import { AuthContext } from "@/App";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";

export function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, setUser, isAdmin } = useContext(AuthContext);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const isMobile = useMobile();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logout bem-sucedido",
      description: "Você saiu da sua conta com sucesso.",
    });
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                  <i className="fas fa-brain text-white text-xl"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AI Olimpíadas</h1>
                  <p className="text-xs text-gray-500">Portugal</p>
                </div>
              </a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <a className="font-medium text-gray-900 hover:text-primary transition">Início</a>
            </Link>
            <Link href="/learning-paths">
              <a className="font-medium text-gray-900 hover:text-primary transition">Aprender</a>
            </Link>
            <Link href="/challenges">
              <a className="font-medium text-gray-900 hover:text-primary transition">Desafios</a>
            </Link>
            <Link href="/leaderboard">
              <a className="font-medium text-gray-900 hover:text-primary transition">Classificações</a>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1 border rounded-full px-2 py-1">
              <span className="text-sm font-medium">PT</span>
              <i className="fas fa-chevron-down text-xs text-gray-500"></i>
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <div className="flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                      <img
                        className="h-full w-full object-cover"
                        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}`}
                        alt={user.name}
                      />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <a className="cursor-pointer w-full">Painel Admin</a>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <a className="cursor-pointer" onClick={handleLogout}>
                      Sair
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:block">
                <Link href="/login">
                  <a>
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      Entrar
                    </Button>
                  </a>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-900 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden">
            <div className="py-3 space-y-3">
              <Link href="/">
                <a className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg">Início</a>
              </Link>
              <Link href="/learning-paths">
                <a className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg">Aprender</a>
              </Link>
              <Link href="/challenges">
                <a className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg">Desafios</a>
              </Link>
              <Link href="/leaderboard">
                <a className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg">Classificações</a>
              </Link>
              <div className="flex items-center space-x-1 border rounded-full px-2 py-1 w-max mx-4 my-2">
                <span className="text-sm font-medium">PT</span>
                <i className="fas fa-chevron-down text-xs text-gray-500"></i>
              </div>
              {!user && (
                <Link href="/login">
                  <a className="block">
                    <Button className="mx-4 w-full bg-primary hover:bg-primary/90 text-white">
                      Entrar
                    </Button>
                  </a>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
