export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  dietaryPreferences: string[];
  allergies: string[];
  healthGoals: string[];
}

export interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner";
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  prepTime: number;
}

export interface DayPlan {
  day: string;
  meals: Meal[];
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

export interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface UserProfile {
  name: string;
  email: string;
  familySize: number;
  familyMembers: FamilyMember[];
}
