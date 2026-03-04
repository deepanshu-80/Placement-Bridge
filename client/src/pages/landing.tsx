import { motion } from "framer-motion";
import { Button } from "@/components/ui-elements";
import { useLocation } from "wouter";
import { ArrowRight, Briefcase, GraduationCap, ShieldCheck, Zap, Video, MessageSquare, UserCircle, Users, FileText } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full min-h-[90vh] flex items-center justify-center relative overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          {/* landing page hero futuristic neon tech workspace */}
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=1080&fit=crop" 
            alt="Futuristic Workspace" 
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,255,0.2)]"
          >
            <Zap className="mr-2 h-4 w-4" /> The Future of Recruitment
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6"
          >
            Bridge the gap to your <br />
            <span className="text-gradient">Dream Career</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-2xl text-muted-foreground max-w-2xl mb-10"
          >
            A high-performance platform connecting visionary students with industry-leading employers. Fast, secure, and beautifully designed.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <Button size="lg" onClick={() => setLocation("/auth")} className="text-lg px-8">
              Join the Network <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => setLocation("/auth")} className="text-lg px-8">
              Post a Job
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 px-4 bg-black/40 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose <span className="text-primary">PlacementBridge</span>?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Engineered for speed, built for success. We've redefined how universities and companies handle recruitment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Authentication & Secure Login", desc: "Safe and secure access for all members of the community." },
              { icon: Video, title: "Senior Video Uploads", desc: "Watch placement experiences and tech stack insights from alumni." },
              { icon: MessageSquare, title: "Interview Questions", desc: "Access company-wise interview questions shared by seniors." },
              { icon: UserCircle, title: "Personal Profiles", desc: "Showcase your placement details or career interests." },
              { icon: Users, title: "Q&A Discussion Forum", desc: "Direct interaction between juniors and seniors for query resolution." },
              { icon: FileText, title: "Resource Sharing", desc: "A centralized hub for notes, links, and study channels." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 rounded-3xl neon-border group cursor-default"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-500">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-background transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
