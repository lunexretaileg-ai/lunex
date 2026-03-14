import { motion } from "framer-motion";
import { Search, PenTool, ShieldCheck, BatteryCharging, ArrowRight, Sparkles, Package, RefreshCcw, Wrench, Clock } from "lucide-react";
import { Link } from "wouter";

const deviceTypes = [
  {
    id: "new",
    icon: <Sparkles className="w-6 h-6" />,
    label: "New",
    tagline: "Brand New / Factory Sealed",
    description: "Factory sealed devices that have never been opened or used. Comes with original Apple packaging.",
    features: ["Factory sealed", "Original packaging", "100% battery health", "Full warranty eligible"],
    badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/25",
    accentClass: "bg-emerald-500",
  },
  {
    id: "open_box",
    icon: <Package className="w-6 h-6" />,
    label: "Open Box",
    tagline: "Opened but Barely Used",
    description: "Devices that were opened but barely used — display units, customer returns, or devices opened but never actively used. Condition is almost identical to new.",
    features: ["Opened but like-new", "Fully tested", "Near-perfect cosmetics", "Original parts intact"],
    badgeClass: "bg-sky-500/10 text-sky-500 border-sky-500/25",
    accentClass: "bg-sky-500",
  },
  {
    id: "refurbished",
    icon: <RefreshCcw className="w-6 h-6" />,
    label: "Refurbished",
    tagline: "Professionally Restored",
    description: "Previously used devices that were professionally restored and tested. May include a new battery and replaced screen, but are fully functional.",
    features: ["40-point inspection", "Battery ≥ 80%", "Deep cleaned", "Lunex certified"],
    badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/25",
    accentClass: "bg-amber-500",
  },
  {
    id: "assembled",
    icon: <Wrench className="w-6 h-6" />,
    label: "Assembled",
    tagline: "Built from Original Parts",
    description: "Devices assembled using original or premium compatible Apple components. Fully tested to ensure 100% functionality — at a fraction of the cost.",
    features: ["Original or compatible parts", "Full functionality tested", "Ideal for value buyers", "Significant savings"],
    badgeClass: "bg-violet-500/10 text-violet-500 border-violet-500/25",
    accentClass: "bg-violet-500",
  },
  {
    id: "used",
    icon: <Clock className="w-6 h-6" />,
    label: "Used",
    tagline: "Previously Owned & Tested",
    description: "Devices that were previously owned and used. Fully tested by Lunex — may have visible cosmetic wear. The condition score tells you exactly what to expect.",
    features: ["Thoroughly tested", "Cosmetic wear visible", "Lowest price tier", "All functions verified"],
    badgeClass: "bg-zinc-400/10 text-zinc-400 border-zinc-400/25",
    accentClass: "bg-zinc-400",
  },
];

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

      {/* ============================================== */}
      {/* DEVICE TYPES EXPLAINED                         */}
      {/* ============================================== */}
      <section className="py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Understanding Device Types</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every Lunex product is classified so you know exactly what you're buying — no surprises.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deviceTypes.map((dt, idx) => (
              <motion.div
                key={dt.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-background rounded-3xl border border-border/50 p-7 flex flex-col hover:border-border hover:shadow-lg transition-all"
              >
                {/* Badge + Icon */}
                <div className="flex items-start justify-between mb-5">
                  <span className={`inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${dt.badgeClass}`}>
                    {dt.label}
                  </span>
                  <div className={`w-10 h-10 rounded-2xl ${dt.accentClass}/10 flex items-center justify-center`} style={{ color: "currentColor" }}>
                    <span className={dt.id === 'new' ? 'text-emerald-500' : dt.id === 'open_box' ? 'text-sky-500' : dt.id === 'refurbished' ? 'text-amber-500' : dt.id === 'assembled' ? 'text-violet-500' : 'text-zinc-400'}>
                      {dt.icon}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-1">{dt.label}</h3>
                <p className="text-sm text-primary font-medium mb-3">{dt.tagline}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{dt.description}</p>

                {/* Features */}
                <ul className="space-y-1.5">
                  {dt.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dt.accentClass}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/shop">
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-semibold text-lg hover:scale-105 transition-transform">
                Browse All Devices <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
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
