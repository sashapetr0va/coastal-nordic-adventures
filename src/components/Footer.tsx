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
    </div>
  </footer>
);

export default Footer;
