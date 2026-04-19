import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, ShoppingCart, Users, BarChart3, LogOut, Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import { MealPlanView } from "@/components/dashboard/MealPlanView";
import { GroceryListView } from "@/components/dashboard/GroceryListView";
import { FamilyProfilesView } from "@/components/dashboard/FamilyProfilesView";
import { NutritionView } from "@/components/dashboard/NutritionView";
import { AIMealPlannerDialog } from "@/components/dashboard/AIMealPlannerDialog";
import { useAuth } from "@/hooks/useAuth";

const tabs = [
  { id: "meals", label: "Meals", icon: CalendarDays },
  { id: "grocery", label: "Grocery List", icon: ShoppingCart },
  { id: "family", label: "Family", icon: Users },
  { id: "nutrition", label: "Nutrition", icon: BarChart3 },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("meals");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 border-r bg-card flex-col">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="NutriNest AI" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-display text-xl font-bold">NutriNest</span>
          </Link>
          {user?.email && <p className="text-xs text-muted-foreground mt-2 truncate">{user.email}</p>}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t space-y-1">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-muted-foreground">Theme</span>
            <DarkModeToggle />
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="NutriNest AI" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-display text-lg font-bold">NutriNest</span>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="p-4 border-t space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary">
              <LogOut className="w-5 h-5" /> Log out
            </button>
          </nav>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 lg:pt-0 pt-16">
        <div className="p-6 md:p-8">
          <div className="flex justify-end mb-4">
            <AIMealPlannerDialog />
          </div>
          {activeTab === "meals" && <MealPlanView />}
          {activeTab === "grocery" && <GroceryListView />}
          {activeTab === "family" && <FamilyProfilesView />}
          {activeTab === "nutrition" && <NutritionView />}
        </div>
      </main>
    </div>
  );
}
