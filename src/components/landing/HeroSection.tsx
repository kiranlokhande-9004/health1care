import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container">
        {/* Dark gradient hero card */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0b0b1f] shadow-2xl">
          {/* Ambient color glows inside the card */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-[28rem] h-[28rem] rounded-full bg-primary/30 blur-[120px]" />
            <div className="absolute top-1/2 right-1/3 w-96 h-96 rounded-full bg-accent/25 blur-[120px]" />
            <div className="absolute -bottom-24 -right-24 w-[32rem] h-[32rem] rounded-full bg-fuchsia-500/20 blur-[120px]" />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-8 items-center p-8 md:p-12 lg:p-16">
            {/* Left: copy */}
            <div className="text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                AI-Powered Family Nutrition
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-5"
              >
                Stop stressing about meals.{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-fuchsia-400 bg-clip-text text-transparent">
                  Let AI plan it.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base md:text-lg text-white/70 mb-8 max-w-xl"
              >
                Smart meal planning, grocery lists, and nutrition tracking for your entire family — personalized in seconds.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
              >
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="bg-white text-[#0b0b1f] hover:bg-white/90 text-base px-7 h-12 rounded-full font-semibold shadow-lg"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white text-base px-7 h-12 rounded-full font-semibold shadow-lg"
                  >
                    See How It Works
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* Right: image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative"
            >
              <div className="absolute -inset-6 bg-gradient-to-br from-primary/40 via-accent/30 to-fuchsia-500/30 blur-3xl rounded-full" />
              <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
                <img
                  src={heroImage}
                  alt="NutriNest AI dashboard preview"
                  className="w-full h-auto block"
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
