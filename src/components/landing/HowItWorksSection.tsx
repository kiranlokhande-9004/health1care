import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Set up your family", description: "Add family members, dietary preferences, allergies, and health goals." },
  { number: "02", title: "Generate meal plans", description: "AI creates a personalized weekly meal plan tailored to your family." },
  { number: "03", title: "Get your grocery list", description: "An organized shopping list is automatically generated from your meals." },
  { number: "04", title: "Track nutrition", description: "Monitor daily calories, macros, and nutrition goals at a glance." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Four simple steps to stress-free family meals.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-6 items-start"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-hero-gradient flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">{step.number}</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold mb-1">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
