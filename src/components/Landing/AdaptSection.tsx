import { ContainerScroll } from "../ui/container-scroll-animation";
import dashboard from "../../../public/images/Screenshot 2025-11-29 at 00.14.15.png";

function AdaptSection() {
  return (
    <div
      id="adapt"
      className="relative h-full bg-white overflow-hidden border-b border-neutral-200 text-black"
    >
      <div className="absolute inset-0">
        {/* Enhanced grid: lighter, finer, and more modern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] bg-[size:2rem_2rem]" />
        {/* Soft overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-transparent" />
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:col-span-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black backdrop-blur-xl border border-neutral-200 shadow-lg shadow-purple-500/10">
              <span className="text-sm text-white font-medium">Adapt</span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-light leading-tight tracking-tight">
              <span className="block text-black">Configure The Agent to </span>
              <span className="block text-black">Know Your Business</span>
            </h2>

            <p className="text-base md:text-lg text-neutral-800 leading-relaxed max-w-xl mx-auto font-light">
              Feed your unique knowledge directly into Zipp. The AI learns,
              grows, and becomes an extension of your team.
            </p>
          </div>
          <div className="flex items-center justify-center text-center leading-relaxed mx-auto lg:col-span-2">
            <ContainerScroll>
              <img
                src={dashboard}
                alt="hero"
                height={720}
                width={1400}
                className="object-cover h-full object-left-top"
                draggable={false}
              />
            </ContainerScroll>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdaptSection;
