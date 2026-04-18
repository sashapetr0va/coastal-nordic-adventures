import portrushImg from "@/assets/portrush-coast.jpg";
import portstewartImg from "@/assets/portstewart-beach.jpg";
import whiterocksImg from "@/assets/whiterocks-beach.jpg";
import benoneImg from "@/assets/benone-beach.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const locations = [
  {
    name: "Portrush",
    description: "Ramore Head, harbour views, and the eastern anchor of the Port Path coastal route.",
    image: portrushImg,
  },
  {
    name: "Portstewart Strand",
    description: "Two miles of golden sand backed by dunes — the western start of the Port Path walking trail.",
    image: portstewartImg,
  },
  {
    name: "Whiterocks Beach",
    description: "Dramatic limestone cliffs on the Causeway Coast Way, with views toward Dunluce Castle.",
    image: whiterocksImg,
  },
  {
    name: "Benone Beach",
    description: "Seven miles of sand beneath Mussenden Temple, with cliff-top paths at Downhill Demesne above.",
    image: benoneImg,
  },
];

const LocationsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="locations" className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-6">
        <div
          className={`text-center max-w-2xl mx-auto mb-16 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
        >
          <p className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4">
            Where We Walk
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground leading-[1.1]">
            Northern Ireland's Finest Coast
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((loc, i) => (
            <div
              key={loc.name}
              className={`group relative rounded-2xl overflow-hidden shadow-lg shadow-foreground/5 hover:shadow-xl hover:shadow-foreground/10 transition-[box-shadow,transform] duration-300 active:scale-[0.98] cursor-pointer ${isVisible ? "animate-fade-up" : "opacity-0"}`}
              style={{ animationDelay: `${200 + i * 100}ms` }}
            >
              <img
                src={loc.image}
                alt={`${loc.name} coastal landscape`}
                className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading text-2xl text-primary-foreground mb-1">
                  {loc.name}
                </h3>
                <p className="text-sand/80 text-sm leading-relaxed">
                  {loc.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
