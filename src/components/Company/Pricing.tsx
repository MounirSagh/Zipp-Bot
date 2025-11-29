import { useState } from "react";
import { Check } from "lucide-react";


function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"yearly" | "monthly">(
    "yearly"
  );

  const plans = [
    {
      name: "Start",
      description:
        "Perfect for small businesses automating their first customer support calls.",
      price: billingCycle === "yearly" ? 950 : 1000,
      badge: null,
      features: [
        "Up to 300 automated calls/month",
        "Basic knowledge base",
        "Standard support",
      ],
      buttonText: "UPGRADE TO START",
      buttonVariant: "outline",
    },
    {
      name: "Growth",
      description:
        "Ideal for scaling teams that need multi-department routing and higher call volume.",
      price: billingCycle === "yearly" ? 1700 : 2000,
      badge: "best choice",
      features: [
        "Everything in Start",
        "Advanced RAG knowledge base",
        "Real-time call routing & escalation",
        "Up to 2000 automated calls/month",
        "Call summaries & transcripts",
        "Priority support",
      ],
      buttonText: "UPGRADE TO GROWTH",
      buttonVariant: "primary",
    },
    {
      name: "Enterprise",
      description:
        "For large businesses needing custom integrations, compliance, and scale.",
      price: null,
      badge: null,
      features: [
        "Everything in Growth",
        "Unlimited call volume",
        "Dedicated onboarding engineer",
        "Custom SLAs (99.9% uptime)",
        "Call summaries & transcripts",
        "Advanced analytics & compliance reports",
      ],
      buttonText: "CONTACT US",
      buttonVariant: "outline",
    },
  ];

  return (
    <div className="mt-10 relative min-h-screen  py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-white z-10" />

      <div className="relative z-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif mb-4 text-black">
            Your Plan, Your Way
          </h1>
          <p className="text-blue-800/60 text-lg mb-8">
            Manage, track, and optimize your digital assets
            <br />
            with a plan built for your needs.
          </p>

          <div className="inline-flex items-center bg-blue-900/60 backdrop-blur-xl border border-white/20 rounded-full p-1 shadow-lg shadow-purple-500/10">
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full transition-all ${
                billingCycle === "yearly"
                  ? "bg-white text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Yearly
            </button>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 border transition-all hover:scale-105 group ${
                plan.badge
                  ? "border-gray-200 bg-white shadow-xl shadow-blue-300/50"
                  : "border-gray-200 bg-white shadow-lg shadow-gray-200/50"
              } hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/20`}
            >
              <div className="relative z-10">
                {plan.badge && (
                  <div className="absolute -top-4 right-8">
                    <span className="bg-blue-900/60 shadow-lg shadow-blue-300/50 text-white text-xs font-semibold px-4 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm mb-6 min-h-[48px]">
                  {plan.description}
                </p>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  {plan.price ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600">/ per month</span>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-orange-600"></div>
                  )}
                  <div className="text-right text-sm text-gray-600 mt-1">
                    {billingCycle === "yearly"
                      ? "billed yearly"
                      : "billed monthly"}
                  </div>
                </div>

                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    plan.buttonVariant === "primary"
                      ? "bg-blue-900/60 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
                      : "bg-white border-2 border-blue-800 hover:bg-blue-50 text-blue-900"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16 text-blue-900/60 text-sm">
          <p>All plans include secure encryption and regular backups</p>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
