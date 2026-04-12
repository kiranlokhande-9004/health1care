import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect to get started",
    features: ["1 family member", "Weekly meal plans", "Basic grocery lists", "Nutrition overview"],
    highlighted: false,
  },
  {
    name: "Family",
    price: "$9",
    period: "/month",
    description: "For the whole family",
    features: ["Up to 6 members", "Unlimited meal plans", "Smart grocery lists", "Detailed nutrition insights", "Allergy management", "Priority support"],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "$19",
    period: "/month",
    description: "Advanced features",
    features: ["Unlimited members", "Custom recipes", "Meal prep guides", "Advanced analytics", "API access", "Dedicated support"],
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg">Start free, upgrade when you need more.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl border p-8 ${
                plan.highlighted
                  ? "bg-hero-gradient text-primary-foreground border-primary shadow-glow scale-105"
                  : "bg-card"
              }`}
            >
              <h3 className={`font-display text-xl font-semibold mb-1 ${plan.highlighted ? "" : ""}`}>{plan.name}</h3>
              <p className={`text-sm mb-4 ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{plan.description}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display text-4xl font-bold">{plan.price}</span>
                <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth">
                <Button
                  className={`w-full rounded-xl ${
                    plan.highlighted
                      ? "bg-card text-foreground hover:bg-card/90"
                      : "bg-hero-gradient text-primary-foreground hover:opacity-90"
                  }`}
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
