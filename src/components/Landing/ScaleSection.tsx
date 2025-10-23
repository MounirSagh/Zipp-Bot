import { Users, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
// import bgvideo from "../../assets/bg2-zip.mp4";
const bgvideo = "/videos/bg2-zip.mp4";
import DottedGlowBackground from "../ui/dotted-glow-background";

function ScaleSection() {
  const features = [
    {
      icon: Users,
      title: "1000+ Concurrent Calls",
      description: "Handle massive call volumes without breaking a sweat",
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Instant responses with sub-second latency",
    },
    {
      icon: Shield,
      title: "99.9% Uptime",
      description: "Enterprise-grade reliability you can count on",
    },
  ];

  return (
    <div
      id="scale"
      className="relative h-full bg-black overflow-hidden rounded-b-"
    >
      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="inset-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="inset-0 w-full h-full object-cover"
              >
                <source src={bgvideo} type="video/mp4" />
              </video>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg shadow-purple-500/10">
              <span className="text-sm text-slate-300 font-medium">Scale</span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-light leading-tight tracking-tight">
              <span className="block text-purple-100">Built to Scale</span>
            </h2>

            <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-xl font-light">
              From startups to enterprise, our infrastructure grows with you.
              Handle thousands of calls simultaneously with zero degradation.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
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
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ScaleSection;
