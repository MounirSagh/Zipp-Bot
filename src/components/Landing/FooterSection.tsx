import { motion } from "framer-motion";

function FooterSection() {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: "Privacy policy", href: "#" },
    { name: "Terms of service", href: "#" },
    { name: "Cookie settings", href: "#" },
  ];

  return (
    <div className="relative bg-black border-t border-white/10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent" />

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-gray-300 text-sm font-light"
          >
            © {currentYear} ZIpp. All rights reserved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center gap-6"
          >
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm text-gray-300 hover:text-orange-100 transition-colors duration-300 relative group font-light"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-orange-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default FooterSection;
