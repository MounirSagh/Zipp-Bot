"use client";

import { useState } from "react";
import { SignIn } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
// import { Zap } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <AuroraBackground>
      <div className="relative h-screen w-full overflow-hidden">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-6 left-6 md:top-8 md:left-8 z-20 select-none"
        >
          <span className="block text-3xl md:text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white/80 drop-shadow-sm">
            Aivo<span className="text-white/80">.</span>
          </span>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[500%] text-center"
          >
            {/* Headline */}
            <h1 className="text-balance text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-white/80 drop-shadow-[0_2px_24px_rgba(168,85,247,0.25)]">
              Empower your website with AI. <br />
              <span className="inline-block">
                Save time. Delight customers.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-pretty mt-6 mx-auto max-w-3xl text-base md:text-xl leading-relaxed tracking-[0.01em] text-white/85">
              Upload your business details—operations, contacts, FAQs—and embed our AI agent with
              a single line of code. Give customers instant answers without hunting through pages,
              and boost satisfaction with every interaction.
            </p>

            {/* CTA */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button className="mt-10 px-8 py-3 text-base md:text-lg font-semibold transition-transform hover:scale-[1.03] bg-white hover:bg-white/90 text-black shadow-lg shadow-purple-500/20">
                  Get Started
                </Button>
              </DialogTrigger>
              <DialogContent className="border-none bg-transparent p-6 rounded-2xl shadow-xl flex justify-center items-center">
                <SignIn afterSignInUrl="/admin" />
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Soft vignette to focus text */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_45%,rgba(0,0,0,0.35)_100%)]" />
      </div>
    </AuroraBackground>
  );
}