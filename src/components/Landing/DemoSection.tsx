import { Calendar, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import bgVideo from "../../assets/bg4-zip.mp4";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SignIn } from "@clerk/clerk-react";
import { useState } from "react";
function DemoSection() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="relative h-full bg-black overflow-hidden flex items-center">
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg shadow-purple-500/10"
            >
              <span className="text-sm text-slate-300 font-medium">
                Get Started
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-6xl font-light leading-tight tracking-tight"
            >
              <span className="block text-orange-100">Experience Zipp </span>
              <span className="block text-orange-50">in action</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-base md:text-lg text-gray-300 leading-relaxed max-w-xl font-light"
            >
              See how our AI agent can revolutionize your customer support
              strategy
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4"
            >
              <button className="group px-8 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 font-normal text-white text-sm transition-all duration-300 flex items-center gap-2 rounded-4xl">
                <Calendar className="w-4 h-4" />
                Schedule Demo
              </button>
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <button className="group px-8 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 font-normal text-white text-sm transition-all duration-300 flex items-center gap-2 rounded-4xl">
                    <UserPlus className="w-4 h-4" />
                    Join WaitList
                  </button>
                </DialogTrigger>
                <DialogContent className="border-none bg-transparent p-6 rounded-2xl shadow-xl flex justify-center items-center">
                  <SignIn afterSignInUrl="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/dashboard" />
                </DialogContent>
              </Dialog>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DemoSection;
