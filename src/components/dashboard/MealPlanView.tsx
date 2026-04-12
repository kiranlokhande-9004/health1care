import { DayPlan } from "@/lib/types";
import { Clock, Flame } from "lucide-react";

interface Props {
  weekPlan: DayPlan[];
  selectedDay: number;
  onDayChange: (day: number) => void;
}

export function MealPlanView({ weekPlan, selectedDay, onDayChange }: Props) {
  const today = weekPlan[selectedDay];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">Weekly Meal Plan</h1>
        <p className="text-muted-foreground">Your personalized meals for the week</p>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {weekPlan.map((day, i) => (
          <button
            key={day.day}
            onClick={() => onDayChange(i)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedDay === i
                ? "bg-hero-gradient text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
          >
            {day.day.slice(0, 3)}
          </button>
        ))}
      </div>

      <h2 className="font-display text-xl font-semibold mb-4">{today.day}</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {today.meals.map((meal) => (
          <div key={meal.id} className="rounded-2xl border bg-card p-5 hover:shadow-glow transition-shadow">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 block">
              {meal.type}
            </span>
            <h3 className="font-display text-lg font-semibold mb-2">{meal.name}</h3>

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{meal.prepTime} min</span>
              <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5" />{meal.calories} cal</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">{meal.protein}g protein</span>
              <span className="text-xs px-2 py-1 rounded-md bg-accent/10 text-accent font-medium">{meal.carbs}g carbs</span>
              <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">{meal.fats}g fats</span>
            </div>

            <div className="mt-4 pt-3 border-t">
              <p className="text-xs text-muted-foreground">
                {meal.ingredients.join(" · ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
