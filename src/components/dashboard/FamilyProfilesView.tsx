import { FamilyMember } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { User, X, AlertCircle } from "lucide-react";

interface Props {
  members: FamilyMember[];
  onRemove: (id: string) => void;
}

export function FamilyProfilesView({ members, onRemove }: Props) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">Family Profiles</h1>
          <p className="text-muted-foreground">{members.length} family members</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {members.map((member) => (
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
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => onRemove(member.id)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Diet</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.dietaryPreferences.map((p) => (
                    <span key={p} className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium capitalize">{p}</span>
                  ))}
                </div>
              </div>

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

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Goals</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.healthGoals.map((g) => (
                    <span key={g} className="text-xs px-2 py-1 rounded-md bg-accent/10 text-accent font-medium capitalize">{g}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
