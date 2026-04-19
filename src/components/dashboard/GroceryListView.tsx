import { useState } from "react";
import { ShoppingCart, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useGroceryItems, useCreateGroceryItem, useUpdateGroceryItem, useDeleteGroceryItem,
} from "@/hooks/useGroceryItems";

export function GroceryListView() {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [category, setCategory] = useState("Other");

  const { data: items = [], isLoading } = useGroceryItems();
  const create = useCreateGroceryItem();
  const update = useUpdateGroceryItem();
  const remove = useDeleteGroceryItem();

  const checkedCount = items.filter((i) => i.checked).length;
  const categories = [...new Set(items.map((i) => i.category))];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    create.mutate(
      { name: name.trim(), quantity: qty.trim(), category: category.trim() || "Other" },
      { onSuccess: () => { setName(""); setQty(""); } },
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">Grocery List</h1>
        <p className="text-muted-foreground">
          {checkedCount} of {items.length} items checked
        </p>
      </div>

      <div className="h-2 rounded-full bg-secondary mb-6 overflow-hidden">
        <div
          className="h-full bg-hero-gradient rounded-full transition-all duration-300"
          style={{ width: `${items.length === 0 ? 0 : (checkedCount / items.length) * 100}%` }}
        />
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-8 flex-wrap">
        <Input placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 min-w-[160px]" />
        <Input placeholder="Quantity (e.g. 2 lbs)" value={qty} onChange={(e) => setQty(e.target.value)} className="w-40" />
        <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-32" />
        <Button type="submit" disabled={create.isPending || !name.trim()}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </form>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <ShoppingCart className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No items yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart className="w-4 h-4 text-primary" />
                <h3 className="font-display text-lg font-semibold">{cat}</h3>
              </div>
              <div className="space-y-2">
                {items.filter((i) => i.category === cat).map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                      item.checked ? "bg-secondary/50 border-border" : "bg-card hover:bg-secondary/30"
                    }`}
                  >
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={(v) => update.mutate({ id: item.id, values: { checked: !!v } })}
                    />
                    <span className={`flex-1 text-sm ${item.checked ? "line-through text-muted-foreground" : ""}`}>{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => remove.mutate(item.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
