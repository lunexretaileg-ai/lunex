import { motion } from "framer-motion";
import { Search, PenTool, ShieldCheck, BatteryCharging, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function HowItWorks() {
  const steps = [
    {
      title: "Sourcing",
      desc: "We source premium returned or gently used Apple devices directly from certified global distributors, cutting out the middlemen.",
      icon: <Search className="w-8 h-8" />
    },
    {
      title: "40-Point Inspection",
      desc: "Every component—from the motherboard to the microphone—is tested using official diagnostics.",
      icon: <ShieldCheck className="w-8 h-8" />
    },
    {
      title: "Restoration",
      desc: "Faulty parts are replaced with genuine or premium compatible components. Batteries below 80% are swapped.",
      icon: <PenTool className="w-8 h-8" />
    },
    {
      title: "Final QA",
      desc: "Devices are graded for cosmetics, deeply cleaned, securely packaged, and listed on Lunex for up to 40% off.",
      icon: <BatteryCharging className="w-8 h-8" />
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      
      {/* Hero */}
      <section className="pt-24 pb-20 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          The Lunex <span className="text-primary">Difference.</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
          Premium Apple devices. Professionally tested. Significantly cheaper.
          We believe everyone deserves access to the Apple ecosystem without the extreme retail markup.
        </p>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Why our prices are lower.</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-background rounded-[2rem] p-10 border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-6 text-muted-foreground">Typical Egypt Market</h3>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3 opacity-60">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
                  Brand new, sealed box
                </li>
                <li className="flex items-start gap-3 opacity-60">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
                  Heavy retailer markup
                </li>
                <li className="flex items-start gap-3 opacity-60">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
                  Import duties on full retail value
                </li>
              </ul>
              <div className="mt-12 pt-8 border-t border-border">
                <div className="text-sm text-muted-foreground mb-1">Example: iPhone 14 Pro Max</div>
                <div className="text-3xl font-bold opacity-60">55,000 EGP</div>
              </div>
            </div>

            <div className="bg-foreground text-background rounded-[2rem] p-10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
              <h3 className="text-xl font-bold mb-6 text-primary">Lunex</h3>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  Professionally Refurbished/Assembled
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  Direct lean sourcing
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  No flagship retail overhead
                </li>
              </ul>
              <div className="mt-12 pt-8 border-t border-border/20">
                <div className="text-sm text-background/60 mb-1">Same Performance. Same Device.</div>
                <div className="text-4xl font-bold text-white">33,000 EGP</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Our Rigorous Process</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">We don't just sell used phones. We engineer trust.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center text-foreground mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 left-[70px] right-0 h-px bg-gradient-to-r from-border to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Condition Explainer */}
      <section className="py-24 bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-12">Condition Scores Explained</h2>
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-background/5 rounded-2xl border border-border/10">
              <div className="text-3xl font-bold text-white mb-2">9-10</div>
              <div className="text-primary font-medium mb-4 uppercase tracking-wider text-xs">Pristine / Like New</div>
              <p className="text-background/70 text-sm">Flawless exterior. Micro-scratches barely visible under intense light. Perfect for gifts.</p>
            </div>
            <div className="p-6 bg-background/5 rounded-2xl border border-border/10">
              <div className="text-3xl font-bold text-white mb-2">8</div>
              <div className="text-primary font-medium mb-4 uppercase tracking-wider text-xs">Excellent</div>
              <p className="text-background/70 text-sm">Light surface wear. No structural damage. Completely unnoticeable with a case.</p>
            </div>
            <div className="p-6 bg-background/5 rounded-2xl border border-border/10">
              <div className="text-3xl font-bold text-white mb-2">7</div>
              <div className="text-primary font-medium mb-4 uppercase tracking-wider text-xs">Good</div>
              <p className="text-background/70 text-sm">Noticeable scratches or scuffs. 100% fully functional with massive price savings.</p>
            </div>
          </div>
          <div className="mt-16">
            <Link href="/shop">
              <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:scale-105 transition-transform">
                Find Your Device
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
