import { useState } from "react";
import { Check } from "lucide-react";
import Ballpit from "../ui/Ballpit";

function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"yearly" | "monthly">(
    "yearly"
  );

  const plans = [
    {
      name: "Start",
      description: "Ideal for individuals managing personal crypto finances.",
      price: billingCycle === "yearly" ? 15 : 18,
      badge: null,
      features: [
        "Up to 5 wallets",
        "Basic portfolio tracking",
        "Transaction history overview",
        "Support 24/7",
      ],
      buttonText: "UPGRADE TO START",
      buttonVariant: "outline",
      trial: "7 days free",
    },
    {
      name: "Growth",
      description:
        "Built for traders and small businesses scaling their web3 operations.",
      price: billingCycle === "yearly" ? 39 : 47,
      badge: "best choice",
      features: [
        "Everything in Start",
        "Unlimited wallets",
        "Advanced portfolio insights",
        "Multi-chain support",
        "Priority customer support 24/7",
      ],
      buttonText: "UPGRADE TO GROWTH",
      buttonVariant: "primary",
      trial: "7 days free",
    },
    {
      name: "Enterprise",
      description: "Perfect for web3 builders, companies and financial teams.",
      price: null,
      badge: null,
      features: [
        "Everything in Growth",
        "Dedicated account manager",
        "API access for custom integrations",
        "Multi-user permissions",
        "SLA-backed 24/7 support",
        "Compliance and audit reports",
      ],
      buttonText: "CONTACT US",
      buttonVariant: "outline",
      trial: "Individual",
    },
  ];

  return (
    <div className="mt-10 relative min-h-screen text-white py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Ballpit
          colors={["#5227FF", "#B19EEF", "#FED7AA"]}
          count={50}
          gravity={0.05}
          friction={0.99}
          restitution={0.8}
        />
      </div>

      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="relative z-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif mb-4 text-orange-100">
            Your Plan, Your Way
          </h1>
          <p className="text-purple-100 text-lg mb-8">
            Manage, track, and optimize your digital assets
            <br />
            with a plan built for your needs.
          </p>


          <div className="inline-flex items-center bg-white/5 backdrop-blur-xl border border-white/20 rounded-full p-1 shadow-lg shadow-purple-500/10">
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
                  ? "border-purple-400/30 bg-white/10 backdrop-blur-2xl shadow-xl shadow-purple-500/20"
                  : "border-white/20 bg-white/5 backdrop-blur-xl shadow-lg shadow-purple-500/10"
              } hover:border-purple-300/50 hover:shadow-2xl hover:shadow-purple-500/30`}
            >
              <div className="relative z-10">

                {plan.badge && (
                  <div className="absolute -top-4 right-8">
                    <span className="bg-white/5 shadow-2xl shadow-purple-300 text-white text-xs font-semibold px-4 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

     
                <h3 className="text-2xl font-semibold mb-3 text-purple-100">
                  {plan.name}
                </h3>
                <p className="text-purple-200/70 text-sm mb-6 min-h-[48px]">
                  {plan.description}
                </p>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-purple-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  {plan.price ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-white">
                        ${plan.price}
                      </span>
                      <span className="text-purple-200/70">/ per month</span>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-orange-200">
                      
                    </div>
                  )}
                  <div className="text-right text-sm text-purple-200/70 mt-1">
                    {billingCycle === "yearly"
                      ? "billed yearly"
                      : "billed monthly"}
                  </div>
                </div>

                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    plan.buttonVariant === "primary"
                      ? "bg-white/5 shadow-lg shadow-purple-500/30"
                      : "bg-white/5 border border-white/30 hover:bg-white/10 text-white backdrop-blur-sm"
                  }`}
                >
                  {plan.buttonText}
                </button>

                {/* Trial info */}
                <div className="text-center text-sm text-purple-200/70 mt-4">
                  {plan.trial}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16 text-purple-200/60 text-sm">
          <p>All plans include secure encryption and regular backups</p>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
