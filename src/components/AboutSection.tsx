import instructorImg from "@/assets/instructor-sasha.jpg";
import walkingImg from "@/assets/nordic-walking-beach.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const AboutSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="about" className="py-24 md:py-32 bg-card" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div
            className={`relative ${isVisible ? "animate-slide-left" : "opacity-0"}`}
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-foreground/10">
              <img
                src={instructorImg}
                alt="Sasha, Nordic walking instructor on a coastal path"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 rounded-xl overflow-hidden shadow-xl w-48 h-36 border-4 border-card hidden md:block">
              <img
                src={walkingImg}
                alt="Group Nordic walking on beach"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div
            className={`space-y-6 ${isVisible ? "animate-slide-right" : "opacity-0"}`}
            style={{ animationDelay: "150ms" }}
          >
            <p className="text-primary uppercase tracking-[0.2em] text-sm font-medium">
              Meet Your Guide
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-[1.1]">
              Hi, I'm Sasha
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
              <p>
                Originally from Ukraine, I've called Coleraine home for the past
                four years. The stunning North Coast captured my heart — and
                Nordic walking became my way of exploring it.
              </p>
              <p>
                I believe fitness should feel like an adventure, not a chore. My
                sessions combine proper Nordic walking technique with the joy of
                discovering hidden beaches, dramatic clifftops, and the
                ever-changing Atlantic horizon.
              </p>
              <p>
                Whether you're a visitor wanting to experience the coast in a
                unique way, or a local looking for a supportive community — I'd
                love to walk with you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
