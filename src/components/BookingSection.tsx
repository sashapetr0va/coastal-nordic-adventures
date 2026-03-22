import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { toast } from "sonner";

const BookingSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const subject = encodeURIComponent(`Booking Request from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nPreferred Date: ${form.date}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:sashe4ka.petrova@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      toast.success("Your email client should open now. Thank you!");
      setSending(false);
    }, 1000);
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow duration-150";

  return (
    <section id="booking" className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div
            className={`text-center mb-12 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
          >
            <p className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4">
              Ready to Walk?
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-[1.1] mb-4">
              Book Your Session
            </h2>
            <p className="text-muted-foreground text-lg">
              Fill in the form below and I'll get back to you within 24 hours.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`space-y-5 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
            style={{ animationDelay: "200ms" }}
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                required
                maxLength={100}
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                required
                maxLength={255}
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                maxLength={20}
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <textarea
              name="message"
              placeholder="Tell me about your group, experience level, or any questions..."
              rows={4}
              maxLength={1000}
              value={form.message}
              onChange={handleChange}
              className={inputClass + " resize-none"}
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-[box-shadow,transform] duration-200 active:scale-[0.98] disabled:opacity-60"
            >
              {sending ? "Opening email..." : "Send Booking Request"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
