import { Brain, ShoppingCart, Users, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "AI Meal Plan Generator",
    description: "Create weekly meal plans based on your family's size, dietary preferences, and health goals.",
  },
  {
    icon: ShoppingCart,
    title: "Smart Grocery Lists",
    description: "Automatically generate organized grocery checklists from your meal plans.",
  },
  {
    icon: Users,
    title: "Family Profile Management",
    description: "Add and manage multiple family members with individual dietary needs and allergies.",
  },
  {
    icon: BarChart3,
    title: "Nutrition Insights",
    description: "Track calories, protein, carbs, and fats for every meal and daily totals.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Everything your family needs
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From meal planning to nutrition tracking, NutriNest handles it all so you can focus on what matters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-2xl bg-card border p-6 hover:shadow-glow transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-hero-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
