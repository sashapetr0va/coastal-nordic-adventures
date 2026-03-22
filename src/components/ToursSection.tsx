import { Clock, Users, MapPin } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const tours = [
  {
    title: "Coastal Walking Tour",
    duration: "1.5–2 hours",
    group: "Up to 8 people",
    location: "Various routes",
    description:
      "Explore stunning cliff paths and beaches with guided instruction, photo stops, and nature discovery.",
    featured: true,
  },
  {
    title: "Beach Nordic Walking",
    duration: "1 hour",
    group: "Up to 10 people",
    location: "Portstewart or Benone",
    description:
      "A fitness-focused session on the sand — feel the resistance underfoot for a deeper workout.",
    featured: false,
  },
  {
    title: "Beginner Lesson",
    duration: "45 minutes",
    group: "Up to 6 people",
    location: "Portrush area",
    description:
      "Learn the correct Nordic walking technique, posture, and pole usage in a relaxed, supportive setting.",
    featured: false,
  },
  {
    title: "Private Tour",
    duration: "Flexible",
    group: "Your group",
    location: "Your choice",
    description:
      "A personalised experience for families, friends, or corporate wellness — tailored to your pace and goals.",
    featured: false,
  },
];

const ToursSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="tours" className="py-24 md:py-32 bg-card" ref={ref}>
      <div className="container mx-auto px-6">
        <div
          className={`text-center max-w-2xl mx-auto mb-16 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4">
            What's On Offer
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-[1.1]">
            Choose Your Walk
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {tours.map((t, i) => (
            <div
              key={t.title}
              className={`relative rounded-2xl p-8 border transition-[box-shadow] duration-300 hover:shadow-lg ${
                t.featured
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-card border-border hover:shadow-foreground/5"
              } ${isVisible ? "animate-fade-up" : "opacity-0"}`}
              style={{ animationDelay: `${200 + i * 100}ms` }}
            >
              {t.featured && (
                <span className="absolute top-4 right-4 text-xs uppercase tracking-widest font-medium bg-primary-foreground/20 px-3 py-1 rounded-full">
                  Popular
                </span>
              )}
              <h3 className="font-heading text-2xl mb-3">{t.title}</h3>
              <p
                className={`mb-5 leading-relaxed ${
                  t.featured ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {t.description}
              </p>
              <div
                className={`flex flex-wrap gap-4 text-sm ${
                  t.featured ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {t.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {t.group}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {t.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToursSection;
