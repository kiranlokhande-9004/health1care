import { GroceryItem } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart } from "lucide-react";

interface Props {
  items: GroceryItem[];
  onToggle: (id: string) => void;
}

export function GroceryListView({ items, onToggle }: Props) {
  const categories = [...new Set(items.map((i) => i.category))];
  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">Grocery List</h1>
        <p className="text-muted-foreground">
          {checkedCount} of {items.length} items checked
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-secondary mb-8 overflow-hidden">
        <div
          className="h-full bg-hero-gradient rounded-full transition-all duration-300"
          style={{ width: `${(checkedCount / items.length) * 100}%` }}
        />
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart className="w-4 h-4 text-primary" />
              <h3 className="font-display text-lg font-semibold">{category}</h3>
            </div>
            <div className="space-y-2">
              {items
                .filter((i) => i.category === category)
                .map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      item.checked ? "bg-secondary/50 border-border" : "bg-card hover:bg-secondary/30"
                    }`}
                  >
                    <Checkbox checked={item.checked} onCheckedChange={() => onToggle(item.id)} />
                    <span className={`flex-1 text-sm ${item.checked ? "line-through text-muted-foreground" : ""}`}>
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.quantity}</span>
                  </label>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
