import {
  HelpCircle,
  Globe,
  Settings,
  Users,
  Building,
  Shield,
} from "lucide-react";
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
    <div
      id="faqs"
      className="relative h-full bg-white overflow-hidden py-24 border-b border-neutral-200"
    >
      <div className="absolute inset-0">
        {/* Enhanced grid: lighter, finer, and more modern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] bg-[size:2rem_2rem]" />
        {/* Soft overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black backdrop-blur-xl border border-black/20 shadow-lg shadow-purple-500/10">
            <span className="text-sm text-white font-medium">FAQs</span>
          </div>

          <h2 className="text-5xl lg:text-6xl font-light leading-tight tracking-tight">
            <span className="block text-black">
              Everything you need to know
            </span>
          </h2>

          <p className="text-base md:text-lg text-gray-700 leading-relaxed font-light">
            Everything you need to know about ZIpp's intelligent support
            platform
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 mb-16">
          {faqs.map((faq, index) => (
            <div key={index} className="group">
              <div
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="cursor-pointer h-full bg-white backdrop-blur-xl border border-black/20 rounded-2xl p-6 hover:bg-black/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
                <DottedGlowBackground
                  className="pointer-events-none mask-radial-to-90% mask-radial-at-center"
                  opacity={1}
                  gap={10}
                  radius={1.6}
                  colorLightVar="--color-pink-200"
                  glowColorLightVar="--color-pink-200"
                  colorDarkVar="--color-pink-200"
                  glowColorDarkVar="--color-sky-200"
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
  );
}

export default FAQSection;
