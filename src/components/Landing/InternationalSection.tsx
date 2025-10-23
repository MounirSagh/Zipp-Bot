import { motion } from "framer-motion";
// import bgGif from "../../assets/mockup-unscreen.gif";
const bgGif = "/videos/mockup-unscreen.gif";

function InternationalSection() {
  return (
    <div
      id="international"
      className="relative h-full bg-black overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffedd515_1px,transparent_1px),linear-gradient(to_bottom,#ffedd510_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
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
                International
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-6xl font-light leading-tight tracking-tight"
            >
              <span className="block text-orange-100">
                Communicate without{" "}
              </span>
              <span className="block text-orange-100">boundaries</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-base md:text-lg text-gray-300 leading-relaxed max-w-xl font-light"
            >
              Our AI agent speaks many languages. It understands context, adapts
              to your knowledge base, and provides instant support across global
              markets.
            </motion.p>

            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4"
            >
              <button className="group px-8 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 font-normal text-white text-sm transition-all duration-300 flex items-center gap-2 rounded-4xl">
                Explore Languages
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mx-auto flex justify-center items-center animate-pulse"
            style={{
              perspective: "1000px",
            }}
          >
            <img
              src={bgGif}
              alt="AI agent demo animation"
              className="w-full max-w-[280px] md:max-w-[320px] lg:max-w-[360px] h-auto"
              style={{
                filter:
                  "drop-shadow(0 10px 30px rgba(255, 255, 255, 0.15)) drop-shadow(0 4px 12px rgba(255, 255, 255, 0.1))",
                transform: "rotateY(-18deg) rotateX(10deg)",
                transformStyle: "preserve-3d",
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default InternationalSection;
