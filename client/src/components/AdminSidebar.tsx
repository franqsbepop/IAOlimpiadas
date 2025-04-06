import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const [location] = useLocation();
  
  const navItems = [
    { path: "/admin", label: "Dashboard", icon: "fa-chart-line" },
    { path: "/admin/content", label: "Conteúdo", icon: "fa-book" },
    { path: "/admin/users", label: "Usuários", icon: "fa-users" },
    { path: "/", label: "Voltar ao Site", icon: "fa-globe" },
  ];
  
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0">
      <div className="p-4">
        <div className="flex items-center space-x-2 py-4 mb-6">
          <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
            <i className="fas fa-brain text-primary text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin</h1>
            <p className="text-xs text-gray-400">AI Olimpíadas</p>
          </div>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a className={cn(
                "flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors",
                location === item.path 
                  ? "bg-primary text-white" 
                  : "text-gray-300 hover:bg-gray-800"
              )}>
                <i className={`fas ${item.icon}`}></i>
                <span>{item.label}</span>
              </a>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 absolute bottom-0 left-0 w-full border-t border-gray-800">
        <div className="flex items-center space-x-3 py-3 px-4">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <i className="fas fa-user text-gray-300"></i>
          </div>
          <div>
            <div className="text-sm font-medium text-white">Admin</div>
            <div className="text-xs text-gray-400">Administrador</div>
          </div>
        </div>
      </div>
    </div>
  );
}
