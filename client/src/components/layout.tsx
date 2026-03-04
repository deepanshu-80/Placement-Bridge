import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui-elements";
import { BriefcaseIcon, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const navLinks = user?.role === "employer" 
    ? [
        { label: "My Postings", href: "/dashboard" },
        { label: "Applications", href: "/employer/applications" },
      ]
    : user?.role === "student"
    ? [
        { label: "Browse Jobs", href: "/dashboard" },
        { label: "My Applications", href: "/student/applications" },
        { label: "Q&A", href: "/qa" },
        { label: "Resources", href: "/resources" },
      ]
    : [
        { label: "Q&A", href: "/qa" },
        { label: "Resources", href: "/resources" },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1a]">
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.4)] group-hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] transition-all">
              <BriefcaseIcon className="text-white w-6 h-6" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all">
              PlacementBridge
            </span>
          </Link>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center space-x-4 pl-8 border-l border-white/10">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-foreground">{user.fullName}</span>
                  <span className="text-xs text-primary capitalize">{user.role}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Sign In</Link>
                <Button onClick={() => setLocation("/auth")}>Get Started</Button>
              </>
            )}
          </nav>
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>
      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-b border-white/5"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-muted-foreground hover:text-primary">
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <div className="py-2 border-b border-white/10">
                    <p className="font-bold text-foreground">{user.fullName}</p>
                    <p className="text-sm text-primary capitalize">{user.role}</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { setLocation("/auth"); setIsMobileMenuOpen(false); }}>
                    Sign In
                  </Button>
                  <Button className="w-full" onClick={() => { setLocation("/auth"); setIsMobileMenuOpen(false); }}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="flex-1 flex flex-col relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] -z-10 pointer-events-none" />
        {children}
      </main>
      <footer className="glass-panel border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_10px_rgba(0,255,255,0.4)]">
                <BriefcaseIcon className="text-white w-5 h-5" />
              </div>
              <span className="font-display font-bold text-lg text-white">PlacementBridge</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering students and alumni through mentorship, resources, and career opportunities.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-white">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              {user?.role === 'admin' && <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Panel</Link></li>}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-white">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/qa" className="hover:text-primary transition-colors">Q&A Forum</Link></li>
              <li><Link href="/resources" className="hover:text-primary transition-colors">Materials</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Job Board</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-white">Social</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all text-muted-foreground hover:text-primary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all text-muted-foreground hover:text-primary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all text-muted-foreground hover:text-primary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PlacementBridge. Connecting talent with opportunity.
        </div>
      </footer>
    </div>
  );
}
