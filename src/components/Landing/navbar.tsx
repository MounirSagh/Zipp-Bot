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
        { name: "Intelligent", href: "/#intelligent" },
        { name: "Adapt", href: "/#adapt" },
        { name: "Scale", href: "/#scale" },
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-xl bg-whtie border-b border-neutral-300 px-40"
          : "bg-transparent  border-b border-neutral-300 mx-40"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-18">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-3xl font-extrabold text-black"
              style={{ fontFamily: "'Major Mono Display', monospace" }}
            >
              Zipp
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8 bg-white/5 backdrop-blur-sm border border-neutral-400 font-normal text-black text-sm transition-all duration-300 rounded-4xl px-10">
            {navLinks.map((link, index) =>
              link.sections ? (
                <DropdownMenu key={index} onOpenChange={setDropdownOpen}>
                  <DropdownMenuTrigger className="relative hover:-translate-y-0.5 hover:text-neutral-600 transition-all duration-500 px-4 py-2 rounded-lg group flex items-center gap-1 outline-none">
                    <span className="relative z-10">{link.name}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="bg-white backdrop-blur-xl border border-neutral-200 text-black min-w-[180px]"
                    sideOffset={8}
                  >
                    {link.sections.map((section, sectionIndex) => (
                      <DropdownMenuItem
                        key={sectionIndex}
                        asChild
                        className="focus:bg-neutral-100 focus:text-neutral-600"
                      >
                        <a
                          href={section.href}
                          className="cursor-pointer hover:text-neutral-600 transition-colors duration-300 py-2"
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
                  className="relative hover:-translate-y-0.5 hover:text-neutral-600 transition-all duration-500 px-4 py-2 rounded-lg group text-black"
                >
                  <span className="relative z-10">{link.name}</span>
                </a>
              )
            )}
          </div>

          <div className="hidden md:flex items-center gap-4 text-black">
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <button className="px-5 py-2 text-black hover:-translate-y-0.5 hover:text-neutral-600 transition-all duration-500">
                  Log in
                </button>
              </DialogTrigger>
              <DialogContent className="border-none bg-transparent p-6 rounded-2xl shadow-xl flex justify-center items-center">
                <SignIn afterSignInUrl="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/dashboard" />
              </DialogContent>
            </Dialog>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <button className="group px-8 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 font-normal text-black text-sm transition-all duration-300 flex items-center gap-2 rounded-4xl">
                  Join WaitList
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </DialogTrigger>
              <DialogContent className="border-none bg-transparent p-6 rounded-2xl shadow-xl flex justify-center items-center">
                <SignIn afterSignInUrl="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/dashboard" />
              </DialogContent>
            </Dialog>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-black hover:bg-white/10 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-4">
            {navLinks.map((link, index) =>
              link.sections ? (
                <div key={index} className="space-y-2">
                  <button
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                    className="w-full text-left text-black py-2 px-3 font-medium flex items-center justify-between hover:text-purple-300 transition-colors duration-300"
                  >
                    {link.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        mobileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      mobileDropdownOpen
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-4 space-y-2">
                      {link.sections.map((section, sectionIndex) => (
                        <a
                          key={sectionIndex}
                          href={section.href}
                          className="block text-black hover:text-purple-300 transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-white/5"
                          onClick={() => setIsOpen(false)}
                        >
                          {section.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={index}
                  href={link.href}
                  className="block text-black hover:text-purple-300 transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-white/5"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              )
            )}
            <div className="pt-4 space-y-3 border-t border-white/10">
              <button className="w-full px-5 py-2 text-black hover:text-purple-300 transition-colors duration-300">
                Sign In
              </button>
              <button className="w-full px-5 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 rounded-xl font-semibold text-black shadow-lg shadow-purple-500/30">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
