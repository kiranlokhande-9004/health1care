import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function AIMealPlannerDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", dietaryPreferences: "", allergies: "", goal: "" });
  const qc = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(form.age, 10);
    if (!form.name.trim() || !age || age < 1 || age > 120) {
      toast.error("Please enter a valid name and age (1-120)");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-meal-planner", {
        body: { name: form.name.trim(), age, dietaryPreferences: form.dietaryPreferences, allergies: form.allergies, goal: form.goal },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);

      toast.success(`Added ${(data as any).mealsAdded} meals & ${(data as any).groceryAdded} grocery items`);
      qc.invalidateQueries({ queryKey: ["meals"] });
      qc.invalidateQueries({ queryKey: ["grocery_items"] });
      setOpen(false);
      setForm({ name: "", age: "", dietaryPreferences: "", allergies: "", goal: "" });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground hover:opacity-90 shadow-glow">
          <Sparkles className="w-4 h-4 mr-1.5" />
          AI Meal Planner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Meal Planner
          </DialogTitle>
          <DialogDescription>
            Tell us about yourself and we'll generate a personalized meal plan and grocery list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ai-name">Name *</Label>
              <Input id="ai-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" maxLength={50} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ai-age">Age *</Label>
              <Input id="ai-age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="30" min={1} max={120} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ai-diet">Dietary preferences</Label>
            <Input id="ai-diet" value={form.dietaryPreferences} onChange={(e) => setForm({ ...form, dietaryPreferences: e.target.value })} placeholder="vegetarian, low-carb…" maxLength={200} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ai-allergies">Allergies</Label>
            <Input id="ai-allergies" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} placeholder="nuts, dairy…" maxLength={200} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ai-goal">Goal</Label>
            <Textarea id="ai-goal" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} placeholder="Lose weight, build muscle, eat healthier…" maxLength={300} rows={2} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? (<><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Generating…</>) : (<><Sparkles className="w-4 h-4 mr-1.5" /> Generate plan</>)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
