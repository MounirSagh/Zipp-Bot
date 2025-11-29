import {
  Users,
  Zap,
  Shield,
  Voicemail,
  Languages,
} from "lucide-react";
import wave from "../../../public/images/wave.png";
import english from "../../../public/images/languages/english.webp";
import franch from "../../../public/images/languages/france.webp";
import arabic from "../../../public/images/languages/morocco.svg";
import spanish from "../../../public/images/languages/spain.png";
import russian from "../../../public/images/languages/russia.svg";
import german from "../../../public/images/languages/germany.png";
import realtime from "../../../public/images/languages/realtime.png";
import uptime from "../../../public/images/uptime-removebg-preview.png";
import concurrent from "../../../public/images/load-removebg-preview.png";

function NoiseTexture({ opacity = 0.4 }: { opacity?: number }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
    >
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

const features = [
  {
    icon: Users,
    title: "Concurrent Calls",
    description: "Handle massive call volumes without breaking a sweat",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description: "Instant responses with sub-second latency",
  },
  {
    icon: Shield,
    title: "Uptime",
    description: "Enterprise-grade reliability you can count on",
  },
  {
    icon: Voicemail,
    title: "Voice API",
    description:
      "Natural, smooth, and empathetic AI conversations with only 500ms latency.",
  },
  {
    icon: Languages,
    title: "Multilingual Support",
    description:
      "Support 18+ languages, can dial to any countries phone numbers",
  },
];

const languageFlags = [
  { src: english, alt: "English", title: "English" },
  { src: franch, alt: "French", title: "Français" },
  { src: spanish, alt: "Spanish", title: "Español" },
  { src: russian, alt: "Russian", title: "Русский" },
  { src: german, alt: "German", title: "Deutsch" },
  { src: arabic, alt: "Arabic", title: "العربية" },
];

function ScaleSection() {
  return (
    <div
      id="scale"
      className="bg-white py-12 px-4 md:px-8 lg:px-12 pb-[100px] mb-[100px] border-b border-neutral-200"
    >
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black backdrop-blur-xl border border-white/20 shadow-lg shadow-purple-500/10">
            <span className="text-sm text-white font-medium">Scale</span>
          </div>

          <h2 className="text-5xl lg:text-6xl font-light leading-tight tracking-tight">
            <span className="block text-black">
              Beyond simple customer support
            </span>
          </h2>

          <p className="text-base md:text-lg text-gray-800 leading-relaxed max-w-xl font-light">
            Zipp transforms customer interactions with intelligent, adaptive
            technology that never sleeps.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {/* 1000+ Concurrent Calls - Large Card (using features[0]) */}
          <div className="md:col-span-2 lg:col-span-2  rounded-3xl bg-blue-800 p-8 relative overflow-hidden min-h-[320px]">
            <NoiseTexture opacity={0.35} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl md:text-2xl font-semibold text-white">
                  {features[0].title}
                </h3>
              </div>
              <p className="text-white/80 text-sm max-w-xs">
                {features[0].description}
              </p>
            </div>
            <img className="absolute right-0 bottom-0 h-[77%]" src={concurrent} />
          </div>


          {/* Voice API Card (using features[3]) */}
          <div className="rounded-3xl bg-blue-500 p-8 relative overflow-hidden min-h-[280px]">
            <NoiseTexture opacity={0.35} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl md:text-2xl font-semibold text-white">
                  {features[3].title}
                </h3>
              </div>
              <p className="text-white/80 text-sm">{features[3].description}</p>
              <img src={wave}  className="mt-10"/>
            </div>
          </div>

          {/* Multilingual Support Card (using features[4]) */}
          <div className="rounded-3xl bg-gradient-to-br from-gray-700 to-gray-800 p-8 relative overflow-hidden min-h-[320px]">
            <NoiseTexture opacity={0.5} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl md:text-2xl font-semibold text-white">
                  {features[4].title}
                </h3>
              </div>
              <p className="text-white/70 text-sm">{features[4].description}</p>
            </div>

            {/* Flags */}
            <div className="absolute left-6 right-6 bottom-6 z-10">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {languageFlags.map((f, i) => (
                    <img
                      key={i}
                      src={f.src}
                      alt={f.alt}
                      title={f.title}
                      className="w-10 h-10 rounded-full border-2 border-white/30 shadow-sm object-cover bg-white"
                    />
                  ))}
                </div>

                <div className="text-white/80 text-sm font-light">
                  Supports 18+ languages
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Processing / Scalability Card (using features[1]) */}
          <div className="rounded-3xl bg-green-700 p-8 relative overflow-hidden min-h-[320px]">
            <NoiseTexture opacity={0.35} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl md:text-2xl font-semibold text-white">
                  {features[1].title}
                </h3>
              </div>
              <p className="text-white/80 text-sm max-w-xs">
                {features[1].description}
              </p>
            </div>
            <img className="absolute bottom-0 h-[77%]" src={realtime} />
          </div>

          <div className="rounded-3xl bg-orange-600/85 p-8 relative overflow-hidden min-h-[320px]">
            <NoiseTexture opacity={0.35} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl md:text-2xl font-semibold text-white">
                  {features[2].title}
                </h3>
              </div>
              <p className="text-white text-sm mb-6">
                {features[2].description}
              </p>
              <img src={uptime}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScaleSection;
