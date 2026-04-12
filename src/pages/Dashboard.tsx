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
import { mockWeekPlan, mockGroceryList, mockFamilyMembers } from "@/lib/mock-data";
import { GroceryItem, FamilyMember } from "@/lib/types";

const tabs = [
  { id: "meals", label: "Meal Plans", icon: CalendarDays },
  { id: "grocery", label: "Grocery List", icon: ShoppingCart },
  { id: "family", label: "Family", icon: Users },
  { id: "nutrition", label: "Nutrition", icon: BarChart3 },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("meals");
  const [selectedDay, setSelectedDay] = useState(0);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>(mockGroceryList);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(mockFamilyMembers);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleGroceryItem = (id: string) => {
    setGroceryList((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
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
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={() => navigate("/")}>
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
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
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
          </nav>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 lg:pt-0 pt-16">
        <div className="p-6 md:p-8">
          {activeTab === "meals" && <MealPlanView weekPlan={mockWeekPlan} selectedDay={selectedDay} onDayChange={setSelectedDay} />}
          {activeTab === "grocery" && <GroceryListView items={groceryList} onToggle={toggleGroceryItem} />}
          {activeTab === "family" && <FamilyProfilesView members={familyMembers} onRemove={removeFamilyMember} />}
          {activeTab === "nutrition" && <NutritionView weekPlan={mockWeekPlan} selectedDay={selectedDay} />}
        </div>
      </main>
    </div>
  );
}
