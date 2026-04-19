import { useMemo, useState } from "react";
import { Clock, Flame, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMeals, useCreateMeal, useUpdateMeal, useDeleteMeal, type MealRow, type MealType } from "@/hooks/useMeals";
import { MealDialog } from "./MealDialog";

const PAGE_SIZE = 9;

export function MealPlanView() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | MealType>("all");
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MealRow | null>(null);
  const [deleting, setDeleting] = useState<MealRow | null>(null);

  const { data: meals = [], isLoading } = useMeals();
  const create = useCreateMeal();
  const update = useUpdateMeal();
  const remove = useDeleteMeal();

  const filtered = useMemo(() => {
    return meals.filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || m.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [meals, search, typeFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">Your Meals</h1>
          <p className="text-muted-foreground">{meals.length} saved meals</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Add meal
        </Button>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search meals…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v as any); setPage(0); }}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{meals.length === 0 ? "No meals yet. Add your first one." : "No meals match your filter."}</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((meal) => (
              <div key={meal.id} className="rounded-2xl border bg-card p-5 hover:shadow-glow transition-shadow flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">{meal.type}</span>
                  <div className="flex gap-1 -mr-2 -mt-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(meal); setDialogOpen(true); }}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setDeleting(meal)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{meal.name}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{meal.prep_time} min</span>
                  <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5" />{meal.calories} cal</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">{meal.protein}g protein</span>
                  <span className="text-xs px-2 py-1 rounded-md bg-accent/10 text-accent font-medium">{meal.carbs}g carbs</span>
                  <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">{meal.fats}g fats</span>
                </div>
                {meal.ingredients.length > 0 && (
                  <div className="mt-4 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">{meal.ingredients.join(" · ")}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
              <span className="text-sm text-muted-foreground">Page {page + 1} of {pageCount}</span>
              <Button variant="outline" size="sm" disabled={page >= pageCount - 1} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </>
      )}

      <MealDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        submitting={create.isPending || update.isPending}
        onSubmit={(values) => {
          if (editing) {
            update.mutate({ id: editing.id, values }, { onSuccess: () => setDialogOpen(false) });
          } else {
            create.mutate(values, { onSuccess: () => setDialogOpen(false) });
          }
        }}
      />

      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This permanently deletes this meal.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
