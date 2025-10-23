import {
  HelpCircle,
  Globe,
  Settings,
  Users,
  Building,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import DottedGlowBackground from "../ui/dotted-glow-background";

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      icon: Globe,
      question: "How does ZIpp handle multiple languages?",
      answer:
        "Our AI is trained in Arabic, English, French, Spanish, German and many more languages with advanced translation capabilities.",
    },
    {
      icon: Settings,
      question: "Can I customize the AI agent?",
      answer:
        "Yes, you can feed your specific knowledge base directly into the system.",
    },
    {
      icon: Users,
      question: "What is the maximum call capacity?",
      answer:
        "ZIpp can handle up to 1000 simultaneous calls without performance degradation.",
    },
    {
      icon: HelpCircle,
      question: "How quickly does the AI learn?",
      answer:
        "Machine learning algorithms adapt in real-time with each customer interaction.",
    },
    {
      icon: Building,
      question: "What industries can use ZIpp?",
      answer:
        "Our platform is designed for enterprises across technology, finance, healthcare, and retail sectors.",
    },
    {
      icon: Shield,
      question: "Is my data secure?",
      answer:
        "We use bank-grade encryption and follow strict data protection regulations.",
    },
  ];

  return (
    <div id="faqs" className="relative h-full bg-black overflow-hidden py-24">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffedd515_1px,transparent_1px),linear-gradient(to_bottom,#ffedd510_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg shadow-purple-500/10"
          >
            <span className="text-sm text-slate-300 font-medium">FAQs</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-5xl lg:text-6xl font-light leading-tight tracking-tight"
          >
            <span className="block text-purple-100">
              Everything you need to know
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-gray-300 leading-relaxed font-light"
          >
            Everything you need to know about ZIpp's intelligent support
            platform
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 mb-16">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <div
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="cursor-pointer h-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
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
      </div>
    </div>
  );
}

export default FAQSection;
