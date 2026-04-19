import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MealRow, MealInput, MealType } from "@/hooks/useMeals";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  type: z.enum(["breakfast", "lunch", "dinner"]),
  calories: z.coerce.number().int().min(0).max(10000),
  protein: z.coerce.number().min(0).max(1000),
  carbs: z.coerce.number().min(0).max(1000),
  fats: z.coerce.number().min(0).max(1000),
  prep_time: z.coerce.number().int().min(0).max(1440),
  ingredients: z.string().max(1000),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: MealRow | null;
  onSubmit: (values: MealInput) => void;
  submitting?: boolean;
}

export function MealDialog({ open, onOpenChange, initial, onSubmit, submitting }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<MealType>("breakfast");
  const [calories, setCalories] = useState("0");
  const [protein, setProtein] = useState("0");
  const [carbs, setCarbs] = useState("0");
  const [fats, setFats] = useState("0");
  const [prepTime, setPrepTime] = useState("0");
  const [ingredients, setIngredients] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setType(initial?.type ?? "breakfast");
      setCalories(String(initial?.calories ?? 0));
      setProtein(String(initial?.protein ?? 0));
      setCarbs(String(initial?.carbs ?? 0));
      setFats(String(initial?.fats ?? 0));
      setPrepTime(String(initial?.prep_time ?? 0));
      setIngredients((initial?.ingredients ?? []).join(", "));
      setErrors({});
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      name, type, calories, protein, carbs, fats, prep_time: prepTime, ingredients,
    });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { fe[i.path[0] as string] = i.message; });
      setErrors(fe);
      return;
    }
    onSubmit({
      name: parsed.data.name,
      type: parsed.data.type,
      calories: parsed.data.calories,
      protein: parsed.data.protein,
      carbs: parsed.data.carbs,
      fats: parsed.data.fats,
      prep_time: parsed.data.prep_time,
      ingredients: ingredients.split(",").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit meal" : "Add meal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="meal-name">Name</Label>
            <Input id="meal-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="meal-type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as MealType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="meal-cal">Calories</Label>
              <Input id="meal-cal" type="number" value={calories} onChange={(e) => setCalories(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="meal-prep">Prep time (min)</Label>
              <Input id="meal-prep" type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="meal-prot">Protein (g)</Label>
              <Input id="meal-prot" type="number" step="0.1" value={protein} onChange={(e) => setProtein(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="meal-carb">Carbs (g)</Label>
              <Input id="meal-carb" type="number" step="0.1" value={carbs} onChange={(e) => setCarbs(e.target.value)} className="mt-1.5" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="meal-fat">Fats (g)</Label>
              <Input id="meal-fat" type="number" step="0.1" value={fats} onChange={(e) => setFats(e.target.value)} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label htmlFor="meal-ing">Ingredients <span className="text-muted-foreground font-normal">(comma-separated)</span></Label>
            <Input id="meal-ing" placeholder="oats, banana, almond milk" value={ingredients} onChange={(e) => setIngredients(e.target.value)} className="mt-1.5" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{initial ? "Save" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
