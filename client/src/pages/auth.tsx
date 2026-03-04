import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button, Card, Input, Label, Textarea } from "@/components/ui-elements";
import { motion, AnimatePresence } from "framer-motion";
import { BriefcaseIcon } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoggingIn, isRegistering } = useAuth();
  const [, setLocation] = useLocation();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    role: "student",
    bio: "",
    skills: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      if (isLogin) {
        await login({ username: formData.username, password: formData.password });
      } else {
        await register({
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName,
          role: formData.role,
          bio: formData.bio || undefined,
          skills: formData.skills || undefined,
        });
      }
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] max-h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <Card className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.4)] mx-auto mb-4">
            <BriefcaseIcon className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-muted-foreground">
            {isLogin ? "Sign in to access your dashboard" : "Join the ultimate placement network"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/20 border border-destructive/50 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-5 overflow-hidden"
              >
                <div className="space-y-2">
                  <Label>I am a...</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`cursor-pointer rounded-xl border ${formData.role === 'student' ? 'border-primary bg-primary/20 shadow-[0_0_10px_rgba(0,255,255,0.2)]' : 'border-white/10 bg-black/40'} p-4 text-center transition-all`}
                      onClick={() => setFormData({ ...formData, role: 'student' })}
                    >
                      <span className="font-semibold">Student</span>
                    </div>
                    <div 
                      className={`cursor-pointer rounded-xl border ${formData.role === 'employer' ? 'border-accent bg-accent/20 shadow-[0_0_10px_rgba(255,0,255,0.2)]' : 'border-white/10 bg-black/40'} p-4 text-center transition-all`}
                      onClick={() => setFormData({ ...formData, role: 'employer' })}
                    >
                      <span className="font-semibold">Employer</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name / Company Name</Label>
                  <Input 
                    id="fullName" 
                    required={!isLogin} 
                    value={formData.fullName} 
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })} 
                    placeholder="John Doe" 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              required 
              value={formData.username} 
              onChange={e => setFormData({ ...formData, username: e.target.value })} 
              placeholder="johndoe123" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={formData.password} 
              onChange={e => setFormData({ ...formData, password: e.target.value })} 
              placeholder="••••••••" 
            />
          </div>

          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-5 overflow-hidden pt-2"
              >
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio {formData.role === 'employer' ? '(Company Info)' : '(About You)'}</Label>
                  <Textarea 
                    id="bio" 
                    value={formData.bio} 
                    onChange={e => setFormData({ ...formData, bio: e.target.value })} 
                    placeholder="Tell us about yourself..." 
                  />
                </div>
                
                {formData.role === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input 
                      id="skills" 
                      value={formData.skills} 
                      onChange={e => setFormData({ ...formData, skills: e.target.value })} 
                      placeholder="React, TypeScript, Node.js" 
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            type="submit" 
            className="w-full mt-6" 
            size="lg"
            isLoading={isLoggingIn || isRegistering}
          >
            {isLogin ? "Sign In" : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
}
