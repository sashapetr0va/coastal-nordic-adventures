import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const links = [
  { label: "About", href: "#about" },
  { label: "Locations", href: "#locations" },
  { label: "Benefits", href: "#benefits" },
  { label: "Tours", href: "#tours" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-foreground/80 backdrop-blur-md border-b border-primary-foreground/10">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2 font-heading text-xl text-primary-foreground tracking-wide">
          <img src={logo} alt="Nordic Walks NI logo" className="h-10 w-auto" />
          Nordic Walks NI
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sand/80 text-sm hover:text-primary-foreground transition-colors duration-150"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#booking"
            className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-[box-shadow] duration-200 active:scale-[0.97]"
          >
            Book Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-primary-foreground active:scale-[0.95]"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-foreground/95 backdrop-blur-md border-t border-primary-foreground/10 pb-6">
          <div className="container mx-auto px-6 flex flex-col gap-4 pt-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sand/80 text-base py-2 hover:text-primary-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="mt-2 text-center px-5 py-3 bg-primary text-primary-foreground font-semibold rounded-lg"
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
