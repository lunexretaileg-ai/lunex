import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import {
  ShieldCheck, BadgeCheck, Battery, Truck,
  Search, FlaskConical, Star, RefreshCw, ArrowRight,
  Cpu, Zap, Package, PackageOpen, Sparkles, Clock
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

const DEVICE_TYPES = [
  {
    Icon: RefreshCw,
    title: "مجدد (Refurbished)", en: "Refurbished",
    desc: "جهاز مستخدم سابقاً تم فحصه وإصلاحه بقطع أصلية Apple.",
    descEn: "Previously used device, inspected and restored with genuine Apple parts.",
    points: ["قطع Hardware أصلية", "تم استبدال أي جزء تالف", "درجة مظهر معتمدة"],
    pointsEn: ["Original Apple hardware", "All faulty parts replaced", "Certified cosmetic grade"],
  },
  {
    Icon: Cpu,
    title: "تجميع (Assembled)", en: "Assembled",
    desc: "جهاز مُجمَّع من قطع أصلية أو عالية الجودة — أداء مطابق بتكلفة أقل.",
    descEn: "Assembled from original or premium-grade parts — matching performance at lower cost.",
    points: ["قطع من موردين معتمدين", "تجميع في بيئة مراقبة", "نفس بروتوكول الاختبار"],
    pointsEn: ["Parts from certified suppliers", "Controlled environment assembly", "Same testing protocol"],
  },
  {
    Icon: Clock,
    title: "مستعمل (Used)", en: "Used",
    desc: "جهاز مستعمل فعلياً، مفحوص بتقييم حالة شفاف كامل.",
    descEn: "Actually used device, inspected with complete transparent condition rating.",
    points: ["فحص شامل لكل الوظائف", "درجة مظهر واضحة ودقيقة", "سعر يتناسب مع الحالة"],
    pointsEn: ["Full function inspection", "Precise cosmetic grade", "Price matched to condition"],
  },
  {
    Icon: PackageOpen,
    title: "Open Box", en: "Open Box",
    desc: "جهاز جديد تم فتح علبته للعرض أو الإرجاع الفوري.",
    descEn: "New device opened for display or immediately returned — typically shows no use.",
    points: ["جديد عملياً بدون عيوب", "بطارية 100% في الغالب", "أرخص من الجديد المختوم"],
    pointsEn: ["Practically new condition", "Usually 100% battery", "Cheaper than sealed new"],
  },
  {
    Icon: Package,
    title: "جديد (New)", en: "New",
    desc: "جهاز جديد مختوم أو بسعر أقل من سعر السوق نتيجة مصادر توريد مباشرة.",
    descEn: "Factory-sealed new device, priced below Egypt retail through direct sourcing.",
    points: ["مختوم المصنع", "ضمان كامل", "أقل من سعر السوق المصري"],
    pointsEn: ["Factory sealed", "Full warranty", "Below Egypt retail price"],
  },
];

const TEST_STEPS = [
  { Icon: FlaskConical,  label: "فحص الهاردوير",   labelEn: "Hardware Check",    desc: "اللوحة الأم، الأزرار، المنافذ، المكبرات", descEn: "Motherboard, buttons, ports, speakers" },
  { Icon: Battery,       label: "قياس البطارية",   labelEn: "Battery Measure",   desc: "بأدوات Apple التشخيصية الاحترافية", descEn: "Using Apple diagnostic tools" },
  { Icon: Search,        label: "فحص الشاشة",      labelEn: "Display Test",      desc: "البكسل، التوحيد، استجابة اللمس", descEn: "Pixels, uniformity, touch response" },
  { Icon: Cpu,           label: "اختبار الكاميرا", labelEn: "Camera Test",       desc: "كل الكاميرات + Face ID / Touch ID", descEn: "All cameras + Face ID / Touch ID" },
  { Icon: Zap,           label: "اختبار الاتصال",  labelEn: "Connectivity",      desc: "Wi-Fi، Bluetooth، 5G، NFC، GPS", descEn: "Wi-Fi, Bluetooth, 5G, NFC, GPS" },
  { Icon: BadgeCheck,    label: "التحقق البرمجي",  labelEn: "Software Check",    desc: "iOS/macOS نظيف، بدون iCloud Lock", descEn: "Clean iOS/macOS, no iCloud Lock" },
  { Icon: Star,          label: "التقييم المظهري", labelEn: "Cosmetic Grade",    desc: "فحص بصري دقيق تحت إضاءة قوية", descEn: "Visual check under strong lighting" },
  { Icon: ShieldCheck,   label: "مراجعة QA",       labelEn: "QA Approval",       desc: "إقرار نهائي وجاهز للشحن", descEn: "Final sign-off, ready to ship" },
];


const CONDITION_SCORES = [
  { score: "10", label: "كالجديد تماماً", labelEn: "Like New",      desc: "لا خدوش إطلاقاً. قد يكون Open Box.", bar: "w-full" },
  { score: "9",  label: "ممتاز",           labelEn: "Excellent",    desc: "خدوش دقيقة تحت الضوء المباشر فقط.", bar: "w-[90%]" },
  { score: "8",  label: "جيد جداً",         labelEn: "Very Good",   desc: "آثار استخدام خفيفة، بدون أضرار هيكلية.", bar: "w-[80%]" },
  { score: "7",  label: "جيد",              labelEn: "Good",        desc: "خدوش مرئية. كل الوظائف تعمل تماماً.", bar: "w-[70%]" },
  { score: "6",  label: "مقبول",             labelEn: "Fair",       desc: "تلف مظهري أوضح. كل الوظائف تعمل.", bar: "w-[60%]" },
];

export default function AboutUs() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith("ar");
  const dir = isAr ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-blue-600/20 blur-[100px]" />
          <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[80px]" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-36 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/8 text-white/80 text-xs font-semibold mb-8 backdrop-blur-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {isAr ? t("about.heroBadge") : t("about.heroBadge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            {isAr ? (
              <>لماذا <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Lunex؟</span></>
            ) : (
              <>Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Lunex?</span></>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            {isAr
              ? "أجهزة Apple الأصيلة. مفحوصة احترافياً. بأسعار تصل إلى 40% أقل من سعر السوق المصري."
              : "Genuine Apple devices. Professionally inspected. Up to 40% below Egypt's retail market."}
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="mt-16 grid grid-cols-3 gap-1 max-w-lg mx-auto"
          >
            {[
              { n: "40%", label: isAr ? "توفير في السعر" : "Price Savings" },
              { n: "8",   label: isAr ? "مرحلة فحص" : "Test Stages" },
              { n: "30+", label: isAr ? "منتج متاح" : "Products Available" },
            ].map(({ n, label }) => (
              <div key={n} className="px-4 py-5 bg-white/6 rounded-2xl border border-white/10">
                <p className="text-3xl font-bold text-white">{n}</p>
                <p className="text-xs text-white/50 mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICE COMPARISON ─────────────────────────────────────── */}
      <section className="py-24 px-6 bg-surface/30 border-y border-border/50">
        <div className="max-w-4xl mx-auto">
          <motion.h2 {...fadeUp()} className="text-3xl font-bold text-center mb-14 text-foreground">
            {isAr ? "لماذا أسعارنا أقل؟" : "Why are our prices lower?"}
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Egypt Market */}
            <motion.div {...fadeUp(0.06)} className="bg-transparent rounded-2xl p-7 border border-border/50">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-5">
                {isAr ? "السوق المصري" : "Egypt Retail"}
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {(isAr
                  ? ["جديد في علبة مختومة", "رسوم استيراد على السعر الكامل", "هامش ربح الموزع الرسمي", "تكاليف المتجر الفيزيائي"]
                  : ["Brand new sealed", "Full import duty on retail price", "Official distributor margin", "Physical store overhead"]
                ).map(item => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full border border-border/60 flex items-center justify-center text-xs text-muted-foreground shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-border/30">
                <p className="text-xs text-muted-foreground">{isAr ? "مثال — iPhone 15 Pro Max" : "Example — iPhone 15 Pro Max"}</p>
                <p className="text-2xl font-bold text-foreground opacity-50 mt-1 line-through">76,500 EGP</p>
              </div>
            </motion.div>

            {/* Lunex */}
            <motion.div {...fadeUp(0.1)} className="relative bg-foreground rounded-2xl p-7 text-background overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-background/5 rounded-full blur-3xl pointer-events-none" />
              <p className="relative text-xs font-bold text-background/50 uppercase tracking-widest mb-5">Lunex</p>
              <ul className="relative space-y-3 text-sm text-background/80">
                {(isAr
                  ? ["مصدر مباشر بدون وسيط", "لا رسوم franchise لـ Apple", "تشغيل رشيق بدون تكاليف ضخمة", "قيمة حقيقية = سعر أقل"]
                  : ["Direct sourcing, no middlemen", "No Apple franchise fees", "Lean operation, low overhead", "Real value = lower price"]
                ).map(item => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full border border-background/20 text-background flex items-center justify-center text-xs shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="relative mt-6 pt-5 border-t border-background/10">
                <p className="text-xs text-background/40">{isAr ? "مثال — iPhone 15 Pro Max" : "Example — iPhone 15 Pro Max"}</p>
                <p className="text-2xl font-bold text-background mt-1">46,500 EGP</p>
                <p className="text-sm text-background/50 mt-1">{isAr ? "توفير ~30,000 EGP (40%)" : "Saving ~30,000 EGP (40%)"}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── DEVICE TYPES ─────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...fadeUp()} className="text-3xl font-bold text-center mb-4 text-gray-900">
            {isAr ? "أنواع الأجهزة عندنا" : "Our Device Types"}
          </motion.h2>
          <motion.p {...fadeUp(0.07)} className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
            {isAr ? "نحن شفافون تماماً في كل شيء — كل جهاز موثق بوضوح." : "We are completely transparent — every device is fully documented."}
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEVICE_TYPES.map((type, i) => {
              const Icon = type.Icon;
              return (
                <motion.div key={type.en} {...fadeUp(i * 0.06)}
                  className="group bg-transparent rounded-2xl border border-border/50 p-6 hover:border-foreground/20 transition-all hover:bg-surface/50"
                >
                  {/* Icon + title row */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center shrink-0 group-hover:border-foreground/30 transition-colors">
                      <Icon className="w-5 h-5 text-foreground/80 group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-semibold text-foreground tracking-wider">
                      {isAr ? type.title : type.en}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {isAr ? type.desc : type.descEn}
                  </p>
                  <ul className="space-y-2">
                    {(isAr ? type.points : type.pointsEn).map(p => (
                      <li key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <BadgeCheck className="w-3.5 h-3.5 text-foreground/30 shrink-0" strokeWidth={1.5} />{p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTING PROCESS ──────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.h2 {...fadeUp()} className="text-3xl font-bold text-center mb-4">
            {isAr ? "عملية الفحص والاختبار" : "Inspection & Testing Process"}
          </motion.h2>
          <motion.p {...fadeUp(0.07)} className="text-center text-white/50 mb-14 max-w-xl mx-auto">
            {isAr
              ? "كل جهاز — بصرف النظر عن نوعه — يمر بـ 8 مراحل اختبار معيارية."
              : "Every device — regardless of type — passes 8 standardized testing stages."}
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEST_STEPS.map(({ Icon, label, labelEn, desc, descEn }, i) => (
              <motion.div key={label} {...fadeUp(i * 0.05)}
                className="bg-transparent border border-white/10 rounded-2xl p-5 hover:bg-white/5 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors">
                    <Icon className="w-4 h-4 text-white/70 group-hover:text-white" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs text-white/30 font-mono ml-auto">0{i + 1}</span>
                </div>
                <p className="font-semibold text-sm text-white mb-1">{isAr ? label : labelEn}</p>
                <p className="text-xs text-white/50 leading-relaxed">{isAr ? desc : descEn}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONDITION SCORE ──────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeUp()} className="text-3xl font-bold text-center mb-4 text-gray-900">
            {isAr ? "نظام تقييم الحالة" : "Condition Rating System"}
          </motion.h2>
          <motion.p {...fadeUp(0.07)} className="text-center text-gray-500 mb-12 max-w-lg mx-auto">
            {isAr
              ? "الدرجة تعكس الحالة المظهرية فقط — الأداء لا يتأثر أبداً."
              : "The score reflects cosmetic condition only — performance is never affected."}
          </motion.p>

          <div className="space-y-4">
            {CONDITION_SCORES.map(({ score, label, labelEn, desc, bar }, i) => (
              <motion.div key={score} {...fadeUp(i * 0.06)}
                className="bg-transparent border border-border/50 rounded-2xl px-6 py-5 flex items-center gap-5 hover:bg-surface/30 transition-colors"
              >
                <div className="text-center shrink-0 w-12">
                  <span className="block text-2xl font-black text-foreground">{score}</span>
                  <span className="text-[10px] text-muted-foreground">/10</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm text-foreground">{isAr ? label : labelEn}</p>
                  </div>
                  <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden border border-border/30">
                    <motion.div
                      className="h-full bg-foreground rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: bar.replace("w-", "").replace("[", "").replace("]", "") }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.1 }}
                      style={{ width: bar === "w-full" ? "100%" : bar.includes("[") ? bar.replace("w-[", "").replace("]", "") : "70%" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WARRANTY & RETURNS ───────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeUp()} className="text-3xl font-bold text-center mb-12 text-foreground">
            {isAr ? "الضمان والإرجاع" : "Warranty & Returns"}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                Icon: ShieldCheck, 
                title: isAr ? "الضمان" : "Warranty",
                items: isAr
                  ? ["3 إلى 6 أشهر حسب نوع الجهاز", "يغطي أعطال الهاردوير الوظيفية", "لا يشمل أضرار السقوط أو الماء", "استبدال أو إصلاح في 7 أيام عمل"]
                  : ["3 to 6 months, by device type & grade", "Covers functional hardware faults", "Does not cover physical or liquid damage", "Replacement or repair within 7 business days"],
              },
              {
                Icon: Truck, 
                title: isAr ? "سياسة الإرجاع" : "Return Policy",
                items: isAr
                  ? ["نافذة إرجاع 7 أيام من تاريخ الاستلام", "الجهاز يُعاد بنفس الحالة", "استرداد كامل في 3-5 أيام عمل", "شحن الإرجاع مجاني للأجهزة المعطلة"]
                  : ["7-day return window from delivery", "Device must be returned as received", "Full refund within 3–5 business days", "Free return shipping for faulty devices"],
              },
            ].map(({ Icon, title, items }) => (
              <motion.div key={title} {...fadeUp(0.08)} className="bg-transparent rounded-2xl p-7 border border-border/50 hover:bg-surface/30 transition-colors">
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-foreground/80" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-4">{title}</h3>
                <ul className="space-y-3">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden bg-gray-900 text-white text-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40" />
        </div>
        <div className="relative z-10 max-w-xl mx-auto">
          <motion.h2 {...fadeUp()} className="text-4xl font-bold mb-4">
            {isAr ? "جاهز تبدأ؟" : "Ready to start?"}
          </motion.h2>
          <motion.p {...fadeUp(0.07)} className="text-white/60 text-lg mb-10">
            {isAr
              ? "تصفح أكثر من 30 جهاز Apple متاح الآن بأسعار Lunex."
              : "Browse 30+ Apple devices available now at Lunex prices."}
          </motion.p>
          <motion.div {...fadeUp(0.14)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <button className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors shadow-xl">
                {isAr ? "تسوق الآن" : "Shop Now"} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </Link>
            <Link href="/build">
              <button className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                {isAr ? "ابني جهازك" : "Build Your Device"}
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
