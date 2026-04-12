import { DayPlan, GroceryItem, FamilyMember } from "./types";

export const mockFamilyMembers: FamilyMember[] = [
  { id: "1", name: "Sarah", age: 35, dietaryPreferences: ["balanced"], allergies: [], healthGoals: ["weight management"] },
  { id: "2", name: "Mike", age: 37, dietaryPreferences: ["high-protein"], allergies: ["shellfish"], healthGoals: ["muscle gain"] },
  { id: "3", name: "Emma", age: 8, dietaryPreferences: ["balanced"], allergies: ["peanuts"], healthGoals: ["healthy growth"] },
  { id: "4", name: "Liam", age: 5, dietaryPreferences: ["balanced"], allergies: [], healthGoals: ["healthy growth"] },
];

export const mockWeekPlan: DayPlan[] = [
  {
    day: "Monday",
    meals: [
      { id: "m1", name: "Greek Yogurt Parfait", type: "breakfast", calories: 320, protein: 18, carbs: 42, fats: 10, ingredients: ["Greek yogurt", "Granola", "Mixed berries", "Honey"], prepTime: 5 },
      { id: "m2", name: "Grilled Chicken Caesar Wrap", type: "lunch", calories: 480, protein: 35, carbs: 38, fats: 20, ingredients: ["Chicken breast", "Romaine lettuce", "Parmesan", "Whole wheat wrap", "Caesar dressing"], prepTime: 15 },
      { id: "m3", name: "Salmon with Roasted Vegetables", type: "dinner", calories: 550, protein: 40, carbs: 30, fats: 28, ingredients: ["Salmon fillet", "Broccoli", "Sweet potato", "Olive oil", "Lemon"], prepTime: 35 },
    ],
  },
  {
    day: "Tuesday",
    meals: [
      { id: "m4", name: "Avocado Toast with Eggs", type: "breakfast", calories: 380, protein: 16, carbs: 30, fats: 22, ingredients: ["Sourdough bread", "Avocado", "Eggs", "Cherry tomatoes"], prepTime: 10 },
      { id: "m5", name: "Quinoa Buddha Bowl", type: "lunch", calories: 420, protein: 18, carbs: 52, fats: 16, ingredients: ["Quinoa", "Chickpeas", "Cucumber", "Red cabbage", "Tahini"], prepTime: 20 },
      { id: "m6", name: "Turkey Meatball Pasta", type: "dinner", calories: 520, protein: 32, carbs: 58, fats: 16, ingredients: ["Ground turkey", "Whole wheat pasta", "Marinara sauce", "Spinach"], prepTime: 30 },
    ],
  },
  {
    day: "Wednesday",
    meals: [
      { id: "m7", name: "Overnight Oats", type: "breakfast", calories: 340, protein: 12, carbs: 48, fats: 12, ingredients: ["Rolled oats", "Almond milk", "Chia seeds", "Banana", "Maple syrup"], prepTime: 5 },
      { id: "m8", name: "Mediterranean Salad", type: "lunch", calories: 390, protein: 20, carbs: 28, fats: 22, ingredients: ["Mixed greens", "Feta cheese", "Olives", "Cucumber", "Hummus", "Pita"], prepTime: 10 },
      { id: "m9", name: "Stir-fry Tofu with Rice", type: "dinner", calories: 460, protein: 22, carbs: 56, fats: 18, ingredients: ["Tofu", "Brown rice", "Bell peppers", "Soy sauce", "Sesame oil"], prepTime: 25 },
    ],
  },
  {
    day: "Thursday",
    meals: [
      { id: "m10", name: "Smoothie Bowl", type: "breakfast", calories: 310, protein: 14, carbs: 46, fats: 8, ingredients: ["Frozen berries", "Banana", "Protein powder", "Granola", "Coconut flakes"], prepTime: 5 },
      { id: "m11", name: "Chicken Noodle Soup", type: "lunch", calories: 350, protein: 28, carbs: 34, fats: 12, ingredients: ["Chicken", "Egg noodles", "Carrots", "Celery", "Chicken broth"], prepTime: 25 },
      { id: "m12", name: "Baked Cod with Quinoa", type: "dinner", calories: 440, protein: 36, carbs: 40, fats: 14, ingredients: ["Cod fillet", "Quinoa", "Asparagus", "Cherry tomatoes", "Herbs"], prepTime: 30 },
    ],
  },
  {
    day: "Friday",
    meals: [
      { id: "m13", name: "Banana Pancakes", type: "breakfast", calories: 360, protein: 12, carbs: 50, fats: 14, ingredients: ["Banana", "Eggs", "Oat flour", "Blueberries", "Maple syrup"], prepTime: 15 },
      { id: "m14", name: "Veggie Quesadilla", type: "lunch", calories: 410, protein: 18, carbs: 42, fats: 20, ingredients: ["Tortilla", "Black beans", "Corn", "Peppers", "Cheese", "Salsa"], prepTime: 15 },
      { id: "m15", name: "Herb-crusted Chicken Thighs", type: "dinner", calories: 530, protein: 38, carbs: 32, fats: 26, ingredients: ["Chicken thighs", "Herbs", "Roasted potatoes", "Green beans"], prepTime: 40 },
    ],
  },
  {
    day: "Saturday",
    meals: [
      { id: "m16", name: "Veggie Omelette", type: "breakfast", calories: 330, protein: 22, carbs: 12, fats: 22, ingredients: ["Eggs", "Spinach", "Mushrooms", "Bell peppers", "Cheese"], prepTime: 10 },
      { id: "m17", name: "Fish Tacos", type: "lunch", calories: 450, protein: 28, carbs: 40, fats: 20, ingredients: ["White fish", "Corn tortillas", "Cabbage slaw", "Lime", "Avocado"], prepTime: 20 },
      { id: "m18", name: "Beef Stew", type: "dinner", calories: 560, protein: 42, carbs: 38, fats: 24, ingredients: ["Beef chuck", "Potatoes", "Carrots", "Onion", "Beef broth"], prepTime: 60 },
    ],
  },
  {
    day: "Sunday",
    meals: [
      { id: "m19", name: "French Toast", type: "breakfast", calories: 370, protein: 14, carbs: 48, fats: 14, ingredients: ["Brioche bread", "Eggs", "Cinnamon", "Vanilla", "Fresh berries"], prepTime: 15 },
      { id: "m20", name: "Caprese Sandwich", type: "lunch", calories: 400, protein: 20, carbs: 36, fats: 20, ingredients: ["Ciabatta", "Mozzarella", "Tomatoes", "Basil", "Balsamic glaze"], prepTime: 10 },
      { id: "m21", name: "Roast Chicken Dinner", type: "dinner", calories: 580, protein: 44, carbs: 36, fats: 28, ingredients: ["Whole chicken", "Roasted vegetables", "Gravy", "Dinner rolls"], prepTime: 90 },
    ],
  },
];

export const mockGroceryList: GroceryItem[] = [
  { id: "g1", name: "Chicken breast", quantity: "1.5 lbs", category: "Protein", checked: false },
  { id: "g2", name: "Salmon fillet", quantity: "4 pieces", category: "Protein", checked: false },
  { id: "g3", name: "Greek yogurt", quantity: "32 oz", category: "Dairy", checked: true },
  { id: "g4", name: "Eggs", quantity: "1 dozen", category: "Dairy", checked: false },
  { id: "g5", name: "Mixed berries", quantity: "2 cups", category: "Produce", checked: false },
  { id: "g6", name: "Broccoli", quantity: "2 heads", category: "Produce", checked: false },
  { id: "g7", name: "Sweet potato", quantity: "4 medium", category: "Produce", checked: true },
  { id: "g8", name: "Avocado", quantity: "3", category: "Produce", checked: false },
  { id: "g9", name: "Quinoa", quantity: "1 bag", category: "Grains", checked: false },
  { id: "g10", name: "Whole wheat pasta", quantity: "1 box", category: "Grains", checked: false },
  { id: "g11", name: "Sourdough bread", quantity: "1 loaf", category: "Grains", checked: false },
  { id: "g12", name: "Olive oil", quantity: "1 bottle", category: "Pantry", checked: true },
  { id: "g13", name: "Granola", quantity: "1 bag", category: "Pantry", checked: false },
  { id: "g14", name: "Almond milk", quantity: "1 carton", category: "Dairy", checked: false },
  { id: "g15", name: "Romaine lettuce", quantity: "2 heads", category: "Produce", checked: false },
];
