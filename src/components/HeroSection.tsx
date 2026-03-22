import heroImg from "@/assets/hero-coast.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <img
        src={heroImg}
        alt="Northern Ireland dramatic coastline with cliffs and golden beach"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="max-w-2xl space-y-6">
          <p
            className="text-sand uppercase tracking-[0.25em] text-sm font-medium animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            Nordic Walking · Northern Ireland
          </p>
          <h1
            className="font-heading text-5xl md:text-7xl text-primary-foreground leading-[1.05] animate-fade-up text-balance"
            style={{ animationDelay: "400ms" }}
          >
            Walk the Coast,
            <br />
            Feel Alive
          </h1>
          <p
            className="text-sand/90 text-lg md:text-xl max-w-lg leading-relaxed animate-fade-up"
            style={{ animationDelay: "600ms" }}
          >
            Guided Nordic walking tours along the most beautiful beaches and
            clifftops of Northern Ireland. Fresh air, gentle exercise, real
            connection.
          </p>
          <div
            className="flex flex-wrap gap-4 pt-4 animate-fade-up"
            style={{ animationDelay: "800ms" }}
          >
            <a
              href="#booking"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-body font-semibold rounded-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-[box-shadow,transform] duration-200 active:scale-[0.97]"
            >
              Book a Walk
            </a>
            <a
              href="#locations"
              className="inline-flex items-center px-8 py-4 border border-sand/40 text-sand font-body font-medium rounded-lg hover:bg-sand/10 transition-colors duration-200 active:scale-[0.97]"
            >
              Explore Locations
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
