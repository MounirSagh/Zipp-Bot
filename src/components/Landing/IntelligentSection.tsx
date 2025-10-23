import { Clock, TrendingUp, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import bgVideo from "../../assets/bg1-zip.mp4";
import DottedGlowBackground from "../ui/dotted-glow-background";

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
      className="relative h-full bg-black overflow-hidden py-24"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative flex items-center justify-center"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[600px] object-cover rounded-3xl shadow-2xl"
            >
              <source src={bgVideo} type="video/mp4" />
            </video>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
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
                Intelligent
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-6xl font-light leading-tight tracking-tight"
            >
              <span className="block text-purple-100">Beyond simple </span>
              <span className="block text-purple-50">customer support</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-base md:text-lg text-gray-300 leading-relaxed max-w-xl font-light"
            >
              ZIpp transforms customer interactions with intelligent, adaptive
              technology that never sleeps.
            </motion.p>

            <div className="space-y-4 pt-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-5 rounded-xl bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-white/20 transition-all duration-300 shadow-lg shadow-purple-500/5"
                >
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {feature.description}
                    </p>
                    <DottedGlowBackground
                      className="pointer-events-none mask-radial-to-90% mask-radial-at-center"
                      opacity={1}
                      gap={10}
                      radius={1.6}
                      colorLightVar="--color-neutral-500"
                      glowColorLightVar="--color-neutral-600"
                      colorDarkVar="--color-neutral-500"
                      glowColorDarkVar="--color-sky-800"
                      backgroundOpacity={0}
                      speedMin={0.3}
                      speedMax={1.6}
                      speedScale={1}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default IntelligentSection;
