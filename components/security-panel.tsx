"use client"

import type React from "react"

import { motion } from "framer-motion"
import { AlertTriangle, Shield } from "lucide-react"

interface SecurityPanelProps {
  implications: string
}

const SecurityPanel: React.FC<SecurityPanelProps> = ({ implications }) => {
  // Parse the implications text
  const lines = implications
    .trim()
    .split("\n")
    .filter((line) => line.trim() !== "")

  // Remove the "Security Implications:" header if present
  const cleanedLines = lines[0].includes("Security Implications") ? lines.slice(1) : lines

  return (
    <motion.div
      className="relative rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1 hidden md:block">
          <div className="h-8 w-8 rounded-full bg-[#2D1215] border border-[#4E2025] flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
        </div>

        <div className="space-y-3 flex-grow">
          {cleanedLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-3 rounded-md bg-[#18181C] border border-[#2E2E34] text-[#E2E2E6]"
            >
              <div className="flex gap-2">
                <Shield className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">{line.trim()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animated warning indicator */}
      <motion.div
        className="absolute -top-2 -right-2 h-3 w-3 rounded-full bg-amber-400"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}

export default SecurityPanel
