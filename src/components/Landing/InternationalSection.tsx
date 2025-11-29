import { motion } from "framer-motion";
import ScrollReveal from "../ScrollReveal";
// import bgGif from "../../assets/mockup-unscreen.gif";

function InternationalSection() {
  return (
    <div
      id="international"
      className="relative h-full bg-black overflow-hidden  border-b border-neutral-800"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffedd515_1px,transparent_1px),linear-gradient(to_bottom,#ffedd510_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-8  max-w-5xl"
          >
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={5}
              blurStrength={10}
            >
              Our AI agent speaks many languages
              and understands context, adapting seamlessly to your knowledge
              base and providing instant support across global markets. 
            </ScrollReveal>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default InternationalSection;
