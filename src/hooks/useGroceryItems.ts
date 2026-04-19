import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAll, createRecord, updateRecord, removeRecord } from "@/services/db";
import { toast } from "sonner";

export interface GroceryItemRow {
  id: string;
  user_id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
  week_start_date: string | null;
  created_at: string;
  updated_at: string;
}

export type GroceryItemInput = {
  name: string;
  quantity?: string;
  category?: string;
  checked?: boolean;
};

const KEY = ["grocery_items"];

export function useGroceryItems() {
  return useQuery({
    queryKey: KEY,
    queryFn: () =>
      getAll<GroceryItemRow>("grocery_items", { orderBy: { column: "created_at", ascending: true } }),
  });
}

export function useCreateGroceryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: GroceryItemInput) => createRecord<GroceryItemRow>("grocery_items", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (e: any) => toast.error(e?.message ?? "Failed to add item"),
  });
}

export function useUpdateGroceryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<GroceryItemRow> }) =>
      updateRecord<GroceryItemRow>("grocery_items", id, values),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (e: any) => toast.error(e?.message ?? "Failed to update item"),
  });
}

export function useDeleteGroceryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeRecord("grocery_items", id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Item removed");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to remove item"),
  });
}
