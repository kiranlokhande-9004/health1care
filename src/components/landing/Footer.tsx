import logo from "@/assets/logo.jpg";

export function Footer() {
  return (
    <footer className="border-t py-12 bg-secondary/20">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="NutriNest AI" className="w-7 h-7 rounded-md object-cover" />
          <span className="font-display font-bold text-foreground">NutriNest AI</span>
        </div>
        <p className="text-sm text-muted-foreground">© 2026 NutriNest AI. All rights reserved.</p>
      </div>
    </footer>
  );
}
