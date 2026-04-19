import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAll, createRecord, updateRecord, removeRecord } from "@/services/db";
import { toast } from "sonner";

export type MealType = "breakfast" | "lunch" | "dinner";

export interface MealRow {
  id: string;
  user_id: string;
  name: string;
  type: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  prep_time: number;
  created_at: string;
  updated_at: string;
}

export type MealInput = Omit<MealRow, "id" | "user_id" | "created_at" | "updated_at">;

const KEY = ["meals"];

export function useMeals() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => getAll<MealRow>("meals", { orderBy: { column: "created_at", ascending: true } }),
  });
}

export function useCreateMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: MealInput) => createRecord<MealRow>("meals", input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Meal added");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to add meal"),
  });
}

export function useUpdateMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<MealInput> }) =>
      updateRecord<MealRow>("meals", id, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Meal updated");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to update meal"),
  });
}

export function useDeleteMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeRecord("meals", id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Meal deleted");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to delete meal"),
  });
}
