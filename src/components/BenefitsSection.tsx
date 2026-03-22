import { Heart, Wind, Users, Mountain, Sparkles, Footprints } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const benefits = [
  {
    icon: Heart,
    title: "Full-Body Workout",
    text: "Nordic walking engages 90% of your muscles — arms, core, and legs — while being gentle on joints.",
  },
  {
    icon: Wind,
    title: "Stress Relief",
    text: "Ocean air, rhythmic movement, and coastal beauty work together to calm the mind naturally.",
  },
  {
    icon: Users,
    title: "Community",
    text: "Walk with like-minded people. Our small groups create genuine connections and lasting friendships.",
  },
  {
    icon: Mountain,
    title: "Explore Nature",
    text: "Discover hidden coves, clifftop paths, and stunning beaches you might never find on your own.",
  },
  {
    icon: Sparkles,
    title: "Beginner Friendly",
    text: "No experience needed. I'll teach you proper technique so you feel confident from the first step.",
  },
  {
    icon: Footprints,
    title: "Burns 40% More",
    text: "Compared to regular walking, Nordic walking burns significantly more calories at the same pace.",
  },
];

const BenefitsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="benefits" className="py-24 md:py-32 bg-ocean-light" ref={ref}>
      <div className="container mx-auto px-6">
        <div
          className={`text-center max-w-2xl mx-auto mb-16 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4">
            Why Nordic Walking
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-[1.1]">
            More Than a Walk
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className={`bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-[box-shadow] duration-300 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
              style={{ animationDelay: `${200 + i * 80}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-forest-light flex items-center justify-center mb-5">
                <b.icon className="w-6 h-6 text-forest" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-xl text-foreground mb-2">
                {b.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {b.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
