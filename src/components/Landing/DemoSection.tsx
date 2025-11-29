import { Mail, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SignIn } from "@clerk/clerk-react";
import { useState } from "react";

function DemoSection() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="relative h-full bg-white overflow-hidden flex items-center  border-b border-neutral-300">
      {/* Background */}
      <div className="absolute inset-0 ml-96">
        <img
          src="/images/globe.avif"
          alt="Background"
          className="absolute inset-0 w-full h- object-cover opacity-85 ml-56"
        />
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section - Left Side */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black backdrop-blur-xl border border-white/20 shadow-lg shadow-purple-500/10">
              <span className="text-sm text-white font-medium">
                Get Started
              </span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-light leading-tight tracking-tight">
              <span className="block text-black">Experience Zipp </span>
              <span className="block text-black">in Action</span>
            </h2>

            <p className="text-base md:text-lg text-black leading-relaxed max-w-xl font-light">
              See how our AI agent can revolutionize your customer support
              strategy
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="group px-8 py-3 bg-black hover:bg-neutral-700 backdrop-blur-sm border border-white/20 font-normal text-white text-sm transition-all duration-300 flex items-center gap-2 rounded-4xl">
                <Mail className="w-4 h-4" />
                Contact Us
              </button>
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <button className="group px-8 py-3 bg-white hover:bg-neutral-100 backdrop-blur-sm border border-neutral-300 font-normal text-black text-sm transition-all duration-300 flex items-center gap-2 rounded-4xl">
                    <UserPlus className="w-4 h-4" />
                    Join WaitList
                  </button>
                </DialogTrigger>
                <DialogContent className="border-none bg-transparent p-6 rounded-2xl shadow-xl flex justify-center items-center">
                  <SignIn afterSignInUrl="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/dashboard" />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DemoSection;
