import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAll, createRecord, updateRecord, removeRecord } from "@/services/db";
import { toast } from "sonner";

export interface FamilyMemberRow {
  id: string;
  user_id: string;
  name: string;
  age: number;
  dietary_preferences: string[];
  allergies: string[];
  health_goals: string[];
  created_at: string;
  updated_at: string;
}

export type FamilyMemberInput = {
  name: string;
  age: number;
  dietary_preferences: string[];
  allergies: string[];
  health_goals: string[];
};

const KEY = ["family_members"];

export function useFamilyMembers() {
  return useQuery({
    queryKey: KEY,
    queryFn: () =>
      getAll<FamilyMemberRow>("family_members", {
        orderBy: { column: "created_at", ascending: true },
      }),
  });
}

export function useCreateFamilyMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: FamilyMemberInput) => createRecord<FamilyMemberRow>("family_members", input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Family member added");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to add"),
  });
}

export function useUpdateFamilyMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<FamilyMemberInput> }) =>
      updateRecord<FamilyMemberRow>("family_members", id, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Family member updated");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to update"),
  });
}

export function useDeleteFamilyMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeRecord("family_members", id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Family member removed");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to remove"),
  });
}
