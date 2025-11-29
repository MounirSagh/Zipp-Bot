import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Check,
  X as XIcon,
  Facebook,
  Instagram,
} from "lucide-react";
import DottedGlowBackground from "../ui/dotted-glow-background";
import PixelBlast from "../PixelBlast";

function ContactSection() {
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   message: "",
  // });

  const features = [
    "Personalized assistance",
    "Timely response",
    "Comprehensive support",
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email us",
      detail: "cognitlabs@gmail.com",
    },
    {
      icon: Phone,
      title: "Call us",
      detail: "+212 691272774",
    },
    {
      icon: MapPin,
      title: "Our location",
      detail: "Casablanca, Morocco",
    },
  ];

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log(formData);
  // };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden py-24">
      <div className="absolute inset-0">
        <PixelBlast
            variant="circle"
            pixelSize={3}
            color="blue"
            patternScale={2}
            patternDensity={1.7}
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

      <div className="container mx-auto px-6 relative z-10 space-y-16">
        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto items-stretch">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-light leading-tight tracking-tight">
                <span className="block text-black">Contact Us</span>
                <span className="inline-flex items-center gap-3">
                  <ArrowUpRight className="w-12 h-12 text-black" />
                </span>
              </h2>

              <p className="text-base md:text-lg text-black leading-relaxed font-light max-w-xl">
                Have a question or need assistance? Reach out to our dedicated
                support team. We're here to help with any inquiries you may
                have.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-neutral-900" />
                  </div>
                  <span className="text-neutral-800 font-light">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-lg bg-black backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-neutral-700 transition-all duration-300">
                <XIcon className="w-4 h-4 text-white" />
              </button>
              <button className="w-10 h-10 rounded-lg bg-black backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-neutral-700 transition-all duration-300">
                <Facebook className="w-4 h-4 text-white" />
              </button>
              <button className="w-10 h-10 rounded-lg bg-black backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-neutral-700 transition-all duration-300">
                <Instagram className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 h-full flex flex-col"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-6 flex-1 flex flex-col"
            >
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-gray-300 focus:outline-none focus:border-white/40 transition-all duration-300 font-light"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-gray-300 focus:outline-none focus:border-white/40 transition-all duration-300 font-light"
                />
              </div>

              <textarea
                placeholder="Message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-gray-300 focus:outline-none focus:border-white/40 transition-all duration-300 resize-none font-light flex-1"
              />

              <button
                type="submit"
                className="w-full bg-white text-black rounded-full px-8 py-4 font-medium hover:bg-gray-100 transition-all duration-300"
              >
                Submit
              </button>
            </form>
          </motion.div> */}
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white backdrop-blur-xl border border-neutral-300 rounded-2xl p-6 space-y-3 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <info.icon className="w-5 h-5 text-black" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-black">{info.title}</h3>
                <p className="text-xs text-black font-light">
                  {info.detail}
                </p>
              </div>
              <DottedGlowBackground
                className="pointer-events-none mask-radial-to-90% mask-radial-at-center"
                opacity={1}
                gap={10}
                radius={1.6}
                colorLightVar="--color-blue-500"
                glowColorLightVar="--color-blue-600"
                colorDarkVar="--color-blue-500"
                glowColorDarkVar="--color-sky-800"
                backgroundOpacity={0}
                speedMin={0.3}
                speedMax={1.6}
                speedScale={1}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactSection;
