import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

interface PlanInput {
  name: string;
  age: number;
  dietaryPreferences?: string;
  allergies?: string;
  goal?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as PlanInput;
    if (!body?.name || !body?.age || body.age < 1 || body.age > 120) {
      return new Response(JSON.stringify({ error: "Name and valid age (1-120) required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a certified nutritionist. Generate a balanced 1-day meal plan (breakfast, lunch, dinner) and a consolidated grocery list. Return ONLY via the provided tool. Be realistic with calories and macros for the user's age.`;

    const userPrompt = `Create a healthy meal plan for:
- Name: ${body.name}
- Age: ${body.age}
- Dietary preferences: ${body.dietaryPreferences || "none"}
- Allergies: ${body.allergies || "none"}
- Goal: ${body.goal || "balanced nutrition"}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "save_meal_plan",
            description: "Save the generated meal plan and grocery list",
            parameters: {
              type: "object",
              properties: {
                meals: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      type: { type: "string", enum: ["breakfast", "lunch", "dinner"] },
                      calories: { type: "number" },
                      protein: { type: "number" },
                      carbs: { type: "number" },
                      fats: { type: "number" },
                      prep_time: { type: "number" },
                      ingredients: { type: "array", items: { type: "string" } },
                    },
                    required: ["name", "type", "calories", "protein", "carbs", "fats", "prep_time", "ingredients"],
                  },
                },
                grocery: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      quantity: { type: "string" },
                      category: { type: "string" },
                    },
                    required: ["name", "quantity", "category"],
                  },
                },
              },
              required: ["meals", "grocery"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "save_meal_plan" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in workspace settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResponse.text();
      console.error("AI error:", aiResponse.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call returned");
    const plan = JSON.parse(toolCall.function.arguments);

    // Insert into DB
    const mealsToInsert = plan.meals.map((m: any) => ({ ...m, user_id: user.id }));
    const groceryToInsert = plan.grocery.map((g: any) => ({ ...g, user_id: user.id, checked: false }));

    const [mealsRes, groceryRes] = await Promise.all([
      supabase.from("meals").insert(mealsToInsert).select(),
      supabase.from("grocery_items").insert(groceryToInsert).select(),
    ]);

    if (mealsRes.error) throw mealsRes.error;
    if (groceryRes.error) throw groceryRes.error;

    return new Response(
      JSON.stringify({
        success: true,
        mealsAdded: mealsRes.data?.length ?? 0,
        groceryAdded: groceryRes.data?.length ?? 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("ai-meal-planner error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
