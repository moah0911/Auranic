import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth-page";
import { motion } from 'framer-motion';
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Scanner line component with animation
const ScannerLine = () => (
  <motion.div
    className="fixed top-0 left-0 right-0 h-2.5 z-50 pointer-events-none"
    style={{ 
      background: 'linear-gradient(to bottom, rgba(176, 38, 255, 0), rgba(176, 38, 255, 0.5), rgba(176, 38, 255, 0))'
    }}
    animate={{
      y: ['0%', '100%', '0%'],
      opacity: [0, 0.3, 0]
    }}
    transition={{
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

// CRT screen effect
const CRTEffect = () => (
  <div className="fixed inset-0 pointer-events-none z-40" 
       style={{ 
         backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%)', 
         backgroundSize: '100% 4px' 
       }}>
  </div>
);

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <ScannerLine />
          <CRTEffect />
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
