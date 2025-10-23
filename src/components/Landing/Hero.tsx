import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
// import bgVideo from "../../assets/bg-zipp.mp4";
const bgVideo = "/videos/bg-zipp.mp4";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SignIn } from "@clerk/clerk-react";

function Hero() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-end">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
      </div>{" "}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10 pb-20 md:pb-24 lg:pb-24">
        <div className="max-w-2xl text-left space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-6xl font-light leading-tight tracking-tight"
          >
            <span className="block text-orange-100">Never Miss a Call</span>
            <span className="block text-purple-50">Never Lose a Customer</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg text-gray-300 leading-relaxed max-w-xl font-light"
          >
            Transform your business communication with intelligent AI agents
            that handle thousands of customer interactions seamlessly across
            multiple languages.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-4 flex items-center gap-4"
          >
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <button className="group px-8 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 font-normal text-white text-sm transition-all duration-300 flex items-center gap-2 rounded-4xl">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </DialogTrigger>
              <DialogContent className="border-none bg-transparent p-6 rounded-2xl shadow-xl flex justify-center items-center">
                <SignIn afterSignInUrl="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/dashboard" />
              </DialogContent>
            </Dialog>
            <button className="group px-6 py-3 rounded-4xl font-semibold text-white transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-500/25 text-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/35">
              <Play className="w-4 h-4" />
              Watch Demo
            </button>
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Hero;
