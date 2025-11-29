import { Clock, TrendingUp, UserCheck } from "lucide-react";
import DottedGlowBackground from "../ui/dotted-glow-background";
import image from '../../../public/images/pexels-tima-miroshnichenko-5453833.jpg'

function IntelligentSection() {
  const features = [
    {
      icon: Clock,
      title: "24/7 availability",
      description: "Always on, always ready to help.",
      color: "from-emerald-600 to-teal-600",
    },
    {
      icon: UserCheck,
      title: "Smart escalation",
      description: "Complex issues routed to human experts seamlessly.",
      color: "from-blue-600 to-cyan-600",
    },
    {
      icon: TrendingUp,
      title: "Continuous learning",
      description: "Each interaction makes the AI smarter and more precise.",
      color: "from-purple-600 to-pink-600",
    },
  ];

  return (
    <div
      id="intelligent"
      className="relative h-full bg-white overflow-hidden py-24  border-b border-neutral-200"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
          <div className="relative flex items-center justify-center">
            <img
              src={image}
              alt="Intelligent AI"
              className="w-full h-[700px] object-cover rounded-3xl shadow-2xl"
            />
          </div>

          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black backdrop-blur-xl border border-white/20 shadow-lg shadow-purple-500/10">
              <span className="text-sm text-white font-medium">
                Intelligent
              </span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-light leading-tight tracking-tight">
              <span className="block text-black">Beyond simple </span>
              <span className="block text-gray-900">customer support</span>
            </h2>

            <p className="text-base md:text-lg text-gray-800 leading-relaxed max-w-xl font-light">
              Zipp transforms customer interactions with intelligent, adaptive
              technology that never sleeps.
            </p>

            <div className="space-y-4 pt-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-5 rounded-xl bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-neutral-300 transition-all duration-300 shadow-lg shadow-purple-500/5"
                >
                  <div>
                    <h3 className="font-semibold text-black mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-800">
                      {feature.description}
                    </p>
                    <DottedGlowBackground
                      className="pointer-events-none mask-radial-to-90% mask-radial-at-center"
                      opacity={1}
                      gap={10}
                      radius={1.6}
                      colorLightVar="--color-blue-500"
                      glowColorLightVar="--color-blue-600"
                      colorDarkVar="--color-pink-500"
                      glowColorDarkVar="--color-sky-800"
                      backgroundOpacity={0}
                      speedMin={0.3}
                      speedMax={1.6}
                      speedScale={1}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntelligentSection;
