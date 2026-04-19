import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { FamilyMemberRow, FamilyMemberInput } from "@/hooks/useFamilyMembers";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(80),
  age: z.coerce.number().int().min(0).max(130),
  dietary_preferences: z.string().max(200),
  allergies: z.string().max(200),
  health_goals: z.string().max(200),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: FamilyMemberRow | null;
  onSubmit: (values: FamilyMemberInput) => void;
  submitting?: boolean;
}

const toCsv = (arr?: string[]) => (arr ?? []).join(", ");
const fromCsv = (s: string) =>
  s.split(",").map((x) => x.trim()).filter(Boolean);

export function FamilyMemberDialog({ open, onOpenChange, initial, onSubmit, submitting }: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [diet, setDiet] = useState("");
  const [allergies, setAllergies] = useState("");
  const [goals, setGoals] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setAge(initial ? String(initial.age) : "");
      setDiet(toCsv(initial?.dietary_preferences));
      setAllergies(toCsv(initial?.allergies));
      setGoals(toCsv(initial?.health_goals));
      setErrors({});
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      name, age, dietary_preferences: diet, allergies, health_goals: goals,
    });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { fe[i.path[0] as string] = i.message; });
      setErrors(fe);
      return;
    }
    onSubmit({
      name: parsed.data.name,
      age: parsed.data.age,
      dietary_preferences: fromCsv(diet),
      allergies: fromCsv(allergies),
      health_goals: fromCsv(goals),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit family member" : "Add family member"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fm-name">Name</Label>
            <Input id="fm-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="fm-age">Age</Label>
            <Input id="fm-age" type="number" min={0} max={130} value={age} onChange={(e) => setAge(e.target.value)} className="mt-1.5" />
            {errors.age && <p className="text-xs text-destructive mt-1">{errors.age}</p>}
          </div>
          <div>
            <Label htmlFor="fm-diet">Dietary preferences <span className="text-muted-foreground font-normal">(comma-separated)</span></Label>
            <Input id="fm-diet" placeholder="vegetarian, low-carb" value={diet} onChange={(e) => setDiet(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="fm-allergies">Allergies</Label>
            <Input id="fm-allergies" placeholder="peanuts, shellfish" value={allergies} onChange={(e) => setAllergies(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="fm-goals">Health goals</Label>
            <Input id="fm-goals" placeholder="weight loss, more protein" value={goals} onChange={(e) => setGoals(e.target.value)} className="mt-1.5" />
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
