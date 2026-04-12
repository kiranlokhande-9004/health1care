import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-12 bg-secondary/20">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-hero-gradient flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground">NutriNest AI</span>
        </div>
        <p className="text-sm text-muted-foreground">© 2026 NutriNest AI. All rights reserved.</p>
      </div>
    </footer>
  );
}
