import LiquidEther from "../ui/LiquidEther";

function Hero() {
  return (
    <div className="bg-white text-black">
      <div className="relative h-[40vh] w-full overflow-hidden border-b border-neutral-200 rounded-4xl">
        <LiquidEther
          colors={["#5227FF", "#B19EEF", "#FED7AA"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center h-full px-4 pointer-events-none">
          <div
            className="text-center space-y-6"
          >
            <h1 className="text-5xl font-light leading-tight tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              <div
                className="flex flex-col md:flex-row items-center justify-center gap-10 mb-4 text-black"
                style={{ fontFamily: "'Major Mono Display', monospace" }}
              >
                <span>Zipp</span>
                <span>gives your business a voice</span>
              </div>
              <span
                className="text-5xl mt-6 text-black"
                style={{ fontFamily: "'Major Mono Display', monospace" }}
              >
                smart, fast, anywhere, and anytime.
              </span>
            </h1>
          </div>
        </div>
      </div>

      <div className=" flex items-center relative h-3/5 w-full px-6 md:px-12 lg:px-24 py-16">
        <div className="max-w-6xl mx-auto">
          <div
            className="space-y-12"
          >
            <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10 pb-20 md:pb-24 lg:pb-24">
              <div className="max-w-2xl text-left space-y-8">
                <h2
                  className="text-5xl md:text-6xl lg:text-6xl font-light leading-tight tracking-tight"
                >
                  <span className="block text-black">Building Tomorrow's</span>
                  <span className="block text-blue-900/60">Conversations Today</span>
                </h2>

                <div
                  className="space-y-6"
                >
                  <p className="text-base md:text-lg text-black leading-relaxed font-light">
                    We're on a mission to revolutionize how businesses
                    communicate. In a world where every customer interaction
                    matters, we believe technology should amplify human
                    connection, not replace it.
                  </p>

                  <p className="text-base md:text-lg text-black leading-relaxed font-light">
                    Zipp was born from a simple yet powerful idea: every
                    business, regardless of size, deserves enterprise-grade AI
                    that works tirelessly to serve their customers with
                    intelligence, empathy, and precision.
                  </p>

                  <p className="text-base md:text-lg text-black leading-relaxed font-light">
                    We're not just building voice AI. We're crafting experiences
                    that turn every call into an opportunity, every conversation
                    into a connection, and every customer into a lasting
                    relationship.
                  </p>
                </div>

                <div
                  className="pt-4"
                >
                  <p className="text-xl md:text-xl text-black leading-relaxed font-light">
                    "Every business has a story worth telling, and every
                    customer deserves to be heard."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="text-center"
        >
          <p className="text-xl md:text-2xl text-black font-light leading-relaxed  max-w-3xl mx-auto">
            "Conversational AI is reshaping business by enabling deeper customer
            engagement and driving innovation. It empowers companies to unlock
            new opportunities, deliver personalized experiences, and accelerate
            growth in ways we never imagined"
          </p>
          <h1 className="mt-10 text-3xl  max-w-3xl mx-auto text-blue-900/60">
            Satya Nadella, CEO of Microsoft
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Hero;
