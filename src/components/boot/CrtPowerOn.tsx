"use client";

import { motion } from "framer-motion";

interface CrtPowerOnProps {
  onComplete: () => void;
}

export default function CrtPowerOn({ onComplete }: CrtPowerOnProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <motion.div
        className="bg-white w-full"
        initial={{ height: 2, opacity: 1 }}
        animate={{ height: "100vh", opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onAnimationComplete={onComplete}
      />
    </div>
  );
}
