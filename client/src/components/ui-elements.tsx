import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none active:scale-95";
    
    const variants = {
      primary: "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] hover:-translate-y-0.5",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-primary/50 text-primary hover:bg-primary/10",
      ghost: "hover:bg-white/5 text-muted-foreground hover:text-foreground",
      danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_15px_rgba(255,0,0,0.2)]",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 text-sm",
      lg: "h-14 px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("glass-panel rounded-2xl neon-border overflow-hidden", className)} {...props} />
));
Card.displayName = "Card";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[100px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all resize-y",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
));
Label.displayName = "Label";

export const Badge = ({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "success" | "warning" | "danger" | "outline" }) => {
  const variants = {
    default: "bg-primary/20 text-primary border border-primary/30",
    success: "bg-green-500/20 text-green-400 border border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    danger: "bg-red-500/20 text-red-400 border border-red-500/30",
    outline: "border border-white/20 text-foreground",
  };
  return (
    <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors", variants[variant], className)} {...props} />
  );
};
