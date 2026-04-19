-- =========================================================
-- Shared updated_at trigger function
-- =========================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================================
-- Meal type enum
-- =========================================================
CREATE TYPE public.meal_type AS ENUM ('breakfast', 'lunch', 'dinner');

-- =========================================================
-- profiles
-- =========================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  family_size INT NOT NULL DEFAULT 1,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- family_members
-- =========================================================
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INT NOT NULL CHECK (age >= 0 AND age <= 130),
  dietary_preferences TEXT[] NOT NULL DEFAULT '{}',
  allergies TEXT[] NOT NULL DEFAULT '{}',
  health_goals TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_family_members_user_id ON public.family_members(user_id);

CREATE POLICY "Users can view their own family members"
  ON public.family_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own family members"
  ON public.family_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own family members"
  ON public.family_members FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own family members"
  ON public.family_members FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON public.family_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- meals
-- =========================================================
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type public.meal_type NOT NULL,
  calories INT NOT NULL DEFAULT 0 CHECK (calories >= 0),
  protein NUMERIC(6,2) NOT NULL DEFAULT 0 CHECK (protein >= 0),
  carbs NUMERIC(6,2) NOT NULL DEFAULT 0 CHECK (carbs >= 0),
  fats NUMERIC(6,2) NOT NULL DEFAULT 0 CHECK (fats >= 0),
  ingredients TEXT[] NOT NULL DEFAULT '{}',
  prep_time INT NOT NULL DEFAULT 0 CHECK (prep_time >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_meals_user_id ON public.meals(user_id);
CREATE INDEX idx_meals_user_type ON public.meals(user_id, type);

CREATE POLICY "Users can view their own meals"
  ON public.meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own meals"
  ON public.meals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own meals"
  ON public.meals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own meals"
  ON public.meals FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_meals_updated_at
  BEFORE UPDATE ON public.meals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- meal_plans (links meals to specific days/weeks)
-- =========================================================
CREATE TABLE public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  week_start_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_meal_plans_user_week ON public.meal_plans(user_id, week_start_date);

CREATE POLICY "Users can view their own meal plans"
  ON public.meal_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own meal plans"
  ON public.meal_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own meal plans"
  ON public.meal_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own meal plans"
  ON public.meal_plans FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON public.meal_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- grocery_items
-- =========================================================
CREATE TABLE public.grocery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Other',
  checked BOOLEAN NOT NULL DEFAULT false,
  week_start_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.grocery_items ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_grocery_items_user_id ON public.grocery_items(user_id);

CREATE POLICY "Users can view their own grocery items"
  ON public.grocery_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own grocery items"
  ON public.grocery_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own grocery items"
  ON public.grocery_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own grocery items"
  ON public.grocery_items FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_grocery_items_updated_at
  BEFORE UPDATE ON public.grocery_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();