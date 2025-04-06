import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import LearningPaths from "@/pages/learning-paths";
import Challenges from "@/pages/challenges";
import Leaderboard from "@/pages/leaderboard";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Lesson from "@/pages/lesson";
import AdminDashboard from "@/pages/admin/index";
import AdminContent from "@/pages/admin/content";
import AdminUsers from "@/pages/admin/users";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect, createContext } from "react";
import { User } from "@/lib/types";

// Create context for user authentication
export const AuthContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  isAdmin: boolean;
}>({
  user: null,
  setUser: () => {},
  isAdmin: false,
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [location] = useLocation();

  // Check if we're on an admin page
  const isAdminPage = location.startsWith("/admin");

  // Check localStorage for user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === "admin");
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, setUser, isAdmin }}>
        {!isAdminPage && <Header />}
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/learning-paths" component={LearningPaths} />
          <Route path="/learning-paths/:id">
            {(params) => <Lesson id={parseInt(params.id)} />}
          </Route>
          <Route path="/challenges" component={Challenges} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/content" component={AdminContent} />
          <Route path="/admin/users" component={AdminUsers} />
          <Route component={NotFound} />
        </Switch>
        {!isAdminPage && <Footer />}
        <Toaster />
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
