import { ArrowRight, Play } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SignIn } from "@clerk/clerk-react";
import PixelBlast from "../PixelBlast";


function Hero() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="relative h-screen bg-white overflow-hidden flex flex-col border-b border-neutral-300">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative h-[100%] flex items-center">
        <div className="absolute inset-0 opacity-20">
          <PixelBlast
            variant="circle"
            pixelSize={4}
            color="black"
            patternScale={3}
            patternDensity={3}
            pixelSizeJitter={1}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={1}
            edgeFade={0.25}
          />
        </div>
        <div className="max-w-1xl mx-auto text-center space-y-4 relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight mt-10">
            <span className="block text-black">Never Miss a Call</span>
            <span className="block text-blue-800/60">Never Lose a Customer</span>
          </h1>

          <p className="text-xl text-black leading-relaxed max-w-3xl mx-auto font-light">
            Transform your business communication with intelligent AI agents
            that handle thousands of customer interactions seamlessly.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <button className="group px-8 py-3 bg-black hover:bg-white/10 backdrop-blur-sm border border-white/20 font-normal text-white text-sm transition-all duration-300 flex items-center gap-2 rounded-4xl">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </DialogTrigger>
              <DialogContent className="border-none bg-transparent p-6 rounded-2xl shadow-xl flex justify-center items-center">
                <SignIn afterSignInUrl="/WjN2Y1hMTk5saEFneUZZeWZScW1uUjVkRkJoU0E9PQ/dashboard" />
              </DialogContent>
            </Dialog>
            <button className="group px-6 py-3 bg-white border border-neutral-300 rounded-4xl font-semibold text-black transition-all duration-300 flex items-center gap-2 text-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/35">
              <Play className="w-4 h-4" />
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* <div className="w-full relative z-10 h-[20%] opacity-80">
        <GradientBlinds
          gradientColors={[
            "#5227FF",
            "#5227FF",
            "#FF9FFC",
            "#FF9FFC",
            "#7530FF",
            "#4B22CC",
          ]}
          angle={225}
          noise={0.8}
          blindCount={20}
          blindMinWidth={60}
          spotlightRadius={0}
          spotlightSoftness={1}
          spotlightOpacity={0}
          mouseDampening={0.15}
          distortAmount={0}
          shineDirection="right"
          mixBlendMode="normal"
        />
      </div> */}
    </div>
  );
}

export default Hero;
