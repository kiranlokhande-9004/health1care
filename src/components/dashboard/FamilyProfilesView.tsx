import { useState } from "react";
import { Plus, Search, User, X, AlertCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useFamilyMembers, useCreateFamilyMember, useUpdateFamilyMember, useDeleteFamilyMember,
  type FamilyMemberRow,
} from "@/hooks/useFamilyMembers";
import { FamilyMemberDialog } from "./FamilyMemberDialog";

export function FamilyProfilesView() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FamilyMemberRow | null>(null);
  const [deleting, setDeleting] = useState<FamilyMemberRow | null>(null);

  const { data: members = [], isLoading } = useFamilyMembers();
  const create = useCreateFamilyMember();
  const update = useUpdateFamilyMember();
  const remove = useDeleteFamilyMember();

  const filtered = members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">Family Profiles</h1>
          <p className="text-muted-foreground">{members.length} family members</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Add member
        </Button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <User className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">{members.length === 0 ? "No family members yet. Add your first one." : "No matches."}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((member) => (
            <div key={member.id} className="rounded-2xl border bg-card p-5 hover:shadow-glow transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-hero-gradient flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{member.name}</h3>
                    <p className="text-xs text-muted-foreground">{member.age} years old</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(member); setDialogOpen(true); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => setDeleting(member)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {member.dietary_preferences.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Diet</p>
                    <div className="flex flex-wrap gap-1.5">
                      {member.dietary_preferences.map((p) => (
                        <span key={p} className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium capitalize">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
                {member.allergies.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Allergies
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {member.allergies.map((a) => (
                        <span key={a} className="text-xs px-2 py-1 rounded-md bg-destructive/10 text-destructive font-medium capitalize">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
                {member.health_goals.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Goals</p>
                    <div className="flex flex-wrap gap-1.5">
                      {member.health_goals.map((g) => (
                        <span key={g} className="text-xs px-2 py-1 rounded-md bg-accent/10 text-accent font-medium capitalize">{g}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <FamilyMemberDialog
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
            <AlertDialogTitle>Remove {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This permanently deletes this family member.</AlertDialogDescription>
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
