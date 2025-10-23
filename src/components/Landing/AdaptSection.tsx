
import { motion } from "framer-motion";
import bgVideo from "../../assets/bg3-zip.mp4";

function AdaptSection() {
  return (
    <div id="adapt" className="relative h-full bg-black overflow-hidden">
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
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
              <span className="text-sm text-slate-300 font-medium">Adapt</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-6xl font-light leading-tight tracking-tight"
            >
              <span className="block text-orange-100">
                Configure your AI to{" "}
              </span>
              <span className="block text-orange-50">know your business</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-base md:text-lg text-gray-300 leading-relaxed max-w-xl font-light"
            >
              Feed your unique knowledge directly into ZIpp. The AI learns,
              grows, and becomes an extension of your team.
            </motion.p>

            {/* <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="group px-8 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 font-normal text-white text-sm transition-all duration-300 flex items-center gap-2 rounded-4xl"
            >
              Details
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button> */}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative group"
          ></motion.div>
        </div>
      </div>
    </div>
  );
}

export default AdaptSection;
