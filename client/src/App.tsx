import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import AuthPage from "@/pages/auth";
import StudentDashboard from "@/pages/student-dashboard";
import EmployerDashboard from "@/pages/employer-dashboard";
import EmployerApplicationsPage from "@/pages/employer-applications";
import StudentApplicationsPage from "@/pages/student-applications";
import { Layout } from "@/components/layout";
import { Loader2 } from "lucide-react";

// Protected Route Wrapper
function ProtectedRoute({ component: Component, allowedRole }: { component: any, allowedRole?: string }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    setLocation("/auth");
    return null;
  }

  if (allowedRole && user.role !== allowedRole) {
    setLocation("/dashboard");
    return null;
  }

  return <Layout><Component /></Layout>;
}

// Smart Dashboard Router based on Role
function DashboardRouter() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) return null;
  
  if (!user) {
    setLocation("/auth");
    return null;
  }

  return (
    <Layout>
      {user.role === 'employer' ? <EmployerDashboard /> : <StudentDashboard />}
    </Layout>
  );
}

import QAPage from "@/pages/qa";
import ResourcesPage from "@/pages/resources";
import AdminPage from "@/pages/admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => {
        const { user } = useAuth();
        const [, setLocation] = useLocation();
        if (user) {
          setLocation("/dashboard");
          return null;
        }
        return <Layout><Landing /></Layout>;
      }} />
      <Route path="/auth" component={() => {
        const { user } = useAuth();
        const [, setLocation] = useLocation();
        if (user) {
          setLocation("/dashboard");
          return null;
        }
        return <Layout><AuthPage /></Layout>;
      }} />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard" component={DashboardRouter} />
      <Route path="/qa" component={() => <Layout><QAPage /></Layout>} />
      <Route path="/resources" component={() => <Layout><ResourcesPage /></Layout>} />
      <Route path="/admin" component={() => <ProtectedRoute component={AdminPage} allowedRole="admin" />} />
      
      {/* Student Specific */}
      <Route path="/student/applications" component={() => <ProtectedRoute component={StudentApplicationsPage} allowedRole="student" />} />
      
      {/* Employer Specific */}
      <Route path="/employer/applications" component={() => <ProtectedRoute component={EmployerApplicationsPage} allowedRole="employer" />} />

      {/* Fallback */}
      <Route component={() => <Layout><NotFound /></Layout>} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
