export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background pt-16 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Support &amp; Help Center
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Questions about orders, shipping, returns, or device quality? Start
            here. In production, this page will be backed by real support
            workflows.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-3xl border border-border/60 p-6 space-y-3">
            <h2 className="text-lg font-semibold">Orders &amp; Shipping</h2>
            <p className="text-sm text-muted-foreground">
              Typical delivery times inside Egypt are 2–5 business days
              depending on your governorate. You will receive SMS/WhatsApp
              updates once real logistics integration is enabled.
            </p>
          </div>
          <div className="bg-card rounded-3xl border border-border/60 p-6 space-y-3">
            <h2 className="text-lg font-semibold">Warranty &amp; Returns</h2>
            <p className="text-sm text-muted-foreground">
              Lunex targets a 3–6 month hardware warranty and a 7‑day return
              window that matches the policy described in the planning document.
            </p>
          </div>
        </section>

        <section className="bg-card rounded-3xl border border-border/60 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Contact form (demo)</h2>
          <p className="text-sm text-muted-foreground">
            This form is static for now. When wired to Supabase and a mail
            provider, it can create support tickets and send confirmation
            emails.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Name
              </label>
              <input className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Message
              </label>
              <textarea className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm min-h-[120px]" />
            </div>
          </div>
          <button className="mt-3 inline-flex px-6 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition">
            Send message (demo)
          </button>
        </section>
      </div>
    </div>
  );
}

