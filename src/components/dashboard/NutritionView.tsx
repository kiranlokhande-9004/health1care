import { DayPlan } from "@/lib/types";
import { Flame, Beef, Wheat, Droplets } from "lucide-react";

interface Props {
  weekPlan: DayPlan[];
  selectedDay: number;
}

export function NutritionView({ weekPlan, selectedDay }: Props) {
  const today = weekPlan[selectedDay];
  const totals = today.meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fats: acc.fats + m.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const stats = [
    { label: "Calories", value: totals.calories, unit: "kcal", icon: Flame, color: "text-accent" },
    { label: "Protein", value: totals.protein, unit: "g", icon: Beef, color: "text-primary" },
    { label: "Carbs", value: totals.carbs, unit: "g", icon: Wheat, color: "text-accent" },
    { label: "Fats", value: totals.fats, unit: "g", icon: Droplets, color: "text-muted-foreground" },
  ];

  // Goals (mock)
  const goals = { calories: 2000, protein: 120, carbs: 250, fats: 70 };
  const goalValues = [goals.calories, goals.protein, goals.carbs, goals.fats];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">Nutrition Summary</h1>
        <p className="text-muted-foreground">{today.day}'s nutrition breakdown</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const pct = Math.min((stat.value / goalValues[i]) * 100, 100);
          return (
            <div key={stat.label} className="rounded-2xl border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className="font-display text-2xl font-bold mb-1">
                {stat.value}
                <span className="text-sm font-normal text-muted-foreground ml-1">{stat.unit}</span>
              </p>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-hero-gradient rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{Math.round(pct)}% of daily goal</p>
            </div>
          );
        })}
      </div>

      <h2 className="font-display text-xl font-semibold mb-4">Meal Breakdown</h2>
      <div className="space-y-3">
        {today.meals.map((meal) => (
          <div key={meal.id} className="rounded-xl border bg-card p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{meal.type}</span>
              <h4 className="font-display font-semibold">{meal.name}</h4>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{meal.calories} cal</span>
              <span className="hidden sm:inline">{meal.protein}g P</span>
              <span className="hidden sm:inline">{meal.carbs}g C</span>
              <span className="hidden sm:inline">{meal.fats}g F</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
