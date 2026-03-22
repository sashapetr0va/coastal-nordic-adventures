const Footer = () => (
  <footer className="bg-foreground border-t border-primary-foreground/10 py-8">
    <div className="container mx-auto px-6 text-center">
      <p className="text-sand/50 text-sm">
        © {new Date().getFullYear()} Nordic Walking Tours Northern Ireland. All
        rights reserved.
      </p>
      <p className="text-sand/40 text-xs mt-2">
        Coleraine, Northern Ireland · Guided by Sasha
      </p>
      {/* TODO: Replace og-image.jpg with your own photo and update this credit */}
      <p className="text-sand/30 text-xs mt-2">
        Beach photo:{" "}
        <a
          href="https://commons.wikimedia.org/wiki/File:Oh_moeder_wat_is_het_heet!_(3445434692).jpg"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-sand/50"
        >
          Gerry Dincher
        </a>
        , CC BY 2.0
      </p>
    </div>
  </footer>
);

export default Footer;
