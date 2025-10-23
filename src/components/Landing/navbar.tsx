import { motion } from "framer-motion";
import { ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SignIn } from "@clerk/clerk-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Company", href: "/Company" },
    {
      name: "Features",
      sections: [
        { name: "International", href: "/#international" },
        { name: "Scale", href: "/#scale" },
        { name: "Adapt", href: "/#adapt" },
        { name: "Intelligent", href: "/#intelligent" },
      ],
    },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQs", href: "/#faqs" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-xl bg-black/30 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-18">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <Link
              to="/"
              className="text-3xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent"
              style={{ fontFamily: "'Major Mono Display', monospace" }}
            >
              Zipp
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden md:flex items-center gap-8 bg-white/5 backdrop-blur-sm border border-white/20 font-normal text-white text-sm transition-all duration-300 rounded-4xl px-10"
          >
            {navLinks.map((link, index) =>
              link.sections ? (
                <DropdownMenu key={index} onOpenChange={setDropdownOpen}>
                  <DropdownMenuTrigger className="relative hover:-translate-y-0.5 hover:text-orange-100 transition-all duration-500 px-4 py-2 rounded-lg group flex items-center gap-1 outline-none">
                    <span className="relative z-10">{link.name}</span>
                    <motion.div
                      animate={{ rotate: dropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="bg-black/90 backdrop-blur-xl border border-white/20 text-white min-w-[180px]"
                    sideOffset={8}
                  >
                    {link.sections.map((section, sectionIndex) => (
                      <DropdownMenuItem
                        key={sectionIndex}
                        asChild
                        className="focus:bg-white/10 focus:text-orange-100"
                      >
                        <a
                          href={section.href}
                          className="cursor-pointer hover:text-orange-100 transition-colors duration-300 py-2"
                        >
                          {section.name}
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <a
                  key={index}
                  href={link.href}
                  className="relative hover:-translate-y-0.5 hover:text-orange-100 transition-all duration-500 px-4 py-2 rounded-lg group"
                >
                  <span className="relative z-10">{link.name}</span>
                </a>
              )
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden md:flex items-center gap-4"
          >
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <button className="px-5 py-2 text-white hover:-translate-y-0.5 hover:text-orange-100 transition-all duration-500">
                  Log in
                </button>
              </DialogTrigger>
              <DialogContent className="border-none bg-transparent p-6 rounded-2xl shadow-xl flex justify-center items-center">
                <SignIn afterSignInUrl="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/dashboard" />
              </DialogContent>
            </Dialog>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <button className="group px-8 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 font-normal text-white text-sm transition-all duration-300 flex items-center gap-2 rounded-4xl">
                  Join WaitList
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </DialogTrigger>
              <DialogContent className="border-none bg-transparent p-6 rounded-2xl shadow-xl flex justify-center items-center">
                <SignIn afterSignInUrl="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/dashboard" />
              </DialogContent>
            </Dialog>
          </motion.div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {navLinks.map((link, index) =>
              link.sections ? (
                <div key={index} className="space-y-2">
                  <button
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                    className="w-full text-left text-slate-300 py-2 px-3 font-medium flex items-center justify-between hover:text-purple-300 transition-colors duration-300"
                  >
                    {link.name}
                    <motion.div
                      animate={{ rotate: mobileDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: mobileDropdownOpen ? "auto" : 0,
                      opacity: mobileDropdownOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 space-y-2">
                      {link.sections.map((section, sectionIndex) => (
                        <a
                          key={sectionIndex}
                          href={section.href}
                          className="block text-slate-400 hover:text-purple-300 transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-white/5"
                          onClick={() => setIsOpen(false)}
                        >
                          {section.name}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <a
                  key={index}
                  href={link.href}
                  className="block text-slate-300 hover:text-purple-300 transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-white/5"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              )
            )}
            <div className="pt-4 space-y-3 border-t border-white/10">
              <button className="w-full px-5 py-2 text-white hover:text-purple-300 transition-colors duration-300">
                Sign In
              </button>
              <button className="w-full px-5 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/30">
                Get Started
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
