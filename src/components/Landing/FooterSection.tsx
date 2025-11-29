
function FooterSection() {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: "Privacy policy", href: "#" },
    { name: "Terms of service", href: "#" },
    { name: "Cookie settings", href: "#" },
  ];

  return (
    <div className="relative bg-white border-t border-neutral-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent" />

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-black text-sm font-light"
          >
            © {currentYear} ZIpp. All rights reserved.
          </p>

          <div
            className="flex flex-wrap items-center gap-6"
          >
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm text-black hover:text-neutral-600 transition-colors duration-300 relative group font-light"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-pink-900/35 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterSection;
