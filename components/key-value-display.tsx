"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface KeyValueDisplayProps {
  dataset: Record<string, string>
  targetKey: string
}

const KeyValueDisplay: React.FC<KeyValueDisplayProps> = ({ dataset, targetKey }) => {
  return (
    <motion.div
      className="grid grid-cols-1 gap-2"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {Object.entries(dataset).map(([key, value], index) => (
        <motion.div
          key={key}
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 },
          }}
          className={`flex justify-between items-center p-2 rounded-md ${
            key === targetKey ? "bg-[#18181C] border border-[#00C2FF]/30" : "bg-[#18181C] border border-[#2E2E34]"
          }`}
        >
          <div className="flex items-center gap-2">
            {key === targetKey && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                className="h-4 w-4 rounded-full bg-[#00C2FF] flex items-center justify-center"
              >
                <Check className="h-3 w-3 text-black" />
              </motion.div>
            )}
            <span
              className={`font-mono text-sm ${key === targetKey ? "text-[#00C2FF] font-medium" : "text-[#8A8A93]"}`}
            >
              {key}
            </span>
          </div>
          <span className={`font-mono text-sm ${key === targetKey ? "text-[#8A2BE2] font-medium" : "text-[#8A8A93]"}`}>
            {value}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default KeyValueDisplay
