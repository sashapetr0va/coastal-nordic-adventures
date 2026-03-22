import { Phone, Mail, MessageCircle, Send } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ContactSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="contact" className="py-24 md:py-32 bg-foreground text-primary-foreground" ref={ref}>
      <div className="container mx-auto px-6">
        <div
          className={`text-center max-w-2xl mx-auto mb-12 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
        >
          <p className="text-sand uppercase tracking-[0.2em] text-sm font-medium mb-4">
            Get in Touch
          </p>
          <h2 className="font-heading text-4xl md:text-5xl leading-[1.1] mb-4">
            Let's Walk Together
          </h2>
          <p className="text-sand/70 text-lg">
            Have questions? Reach out anytime — I'd love to hear from you.
          </p>
        </div>

        <div
          className={`flex flex-wrap justify-center gap-6 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
          style={{ animationDelay: "200ms" }}
        >
          <a
            href="https://wa.me/447541772498"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors duration-200 active:scale-[0.97]"
          >
            <MessageCircle className="w-5 h-5 text-forest" />
            <span>WhatsApp</span>
          </a>
          <a
            href="https://t.me/+447541772498"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors duration-200 active:scale-[0.97]"
          >
            <Send className="w-5 h-5 text-primary" />
            <span>Telegram</span>
          </a>
          <a
            href="tel:+447541772498"
            className="flex items-center gap-3 px-6 py-4 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors duration-200 active:scale-[0.97]"
          >
            <Phone className="w-5 h-5 text-sand" />
            <span>+44 7541 772498</span>
          </a>
          <a
            href="mailto:sashe4ka.petrova@gmail.com"
            className="flex items-center gap-3 px-6 py-4 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors duration-200 active:scale-[0.97]"
          >
            <Mail className="w-5 h-5 text-sand" />
            <span>Email</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
