"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface ProbabilityChartProps {
  probabilities: Record<string, number>
  targetKey: string
}

const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ probabilities, targetKey }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with higher resolution for retina displays
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Set styles
    ctx.font = "12px Inter, system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Draw chart
    const margin = { top: 30, right: 30, bottom: 50, left: 60 }
    const width = rect.width - margin.left - margin.right
    const height = rect.height - margin.top - margin.bottom

    // Sort probabilities for consistent display
    const sortedEntries = Object.entries(probabilities).sort(([keyA], [keyB]) => {
      return keyA.localeCompare(keyB)
    })

    const barWidth = (width / sortedEntries.length) * 0.6
    const barSpacing = width / sortedEntries.length

    // Draw axes
    ctx.strokeStyle = "#2E2E34"
    ctx.lineWidth = 1

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, margin.top + height)
    ctx.stroke()

    // X-axis
    ctx.beginPath()
    ctx.moveTo(margin.left, margin.top + height)
    ctx.lineTo(margin.left + width, margin.top + height)
    ctx.stroke()

    // Y-axis ticks and labels
    ctx.fillStyle = "#8A8A93"
    ctx.textAlign = "right"
    for (let i = 0; i <= 1; i += 0.2) {
      const y = margin.top + height - i * height

      // Tick
      ctx.beginPath()
      ctx.moveTo(margin.left - 5, y)
      ctx.lineTo(margin.left, y)
      ctx.stroke()

      // Label
      ctx.fillText((i * 100).toFixed(0) + "%", margin.left - 10, y)

      // Grid line
      ctx.strokeStyle = "#1E1E22"
      ctx.beginPath()
      ctx.moveTo(margin.left, y)
      ctx.lineTo(margin.left + width, y)
      ctx.stroke()
      ctx.strokeStyle = "#2E2E34"
    }

    // Draw bars
    sortedEntries.forEach(([key, probability], index) => {
      const x = margin.left + index * barSpacing + (barSpacing - barWidth) / 2
      const barHeight = probability * height
      const y = margin.top + height - barHeight

      // Gradient for bars
      const gradient = ctx.createLinearGradient(x, y, x, margin.top + height)

      if (key === targetKey) {
        gradient.addColorStop(0, "#00C2FF")
        gradient.addColorStop(1, "#0099CC")
        ctx.fillStyle = gradient
      } else {
        gradient.addColorStop(0, "#8A2BE2")
        gradient.addColorStop(1, "#7722BB")
        ctx.fillStyle = gradient
      }

      // Bar
      ctx.fillRect(x, y, barWidth, barHeight)

      // Bar border
      ctx.strokeStyle = key === targetKey ? "#00C2FF" : "#8A2BE2"
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, barWidth, barHeight)

      // Bar label (key)
      ctx.fillStyle = "#E2E2E6"
      ctx.textAlign = "center"
      ctx.fillText(key, x + barWidth / 2, margin.top + height + 20)

      // Probability percentage
      if (probability > 0.05) {
        ctx.fillStyle = "#FFFFFF"
        ctx.font = "10px Inter, system-ui, sans-serif"
        ctx.fillText((probability * 100).toFixed(1) + "%", x + barWidth / 2, y + barHeight / 2)
        ctx.font = "12px Inter, system-ui, sans-serif"
      }
    })

    // Chart title
    ctx.fillStyle = "#8A8A93"
    ctx.textAlign = "center"
    ctx.font = "12px Inter, system-ui, sans-serif"
    ctx.fillText("State Probabilities", rect.width / 2, 15)
  }, [probabilities, targetKey])

  return (
    <motion.div
      className="relative h-64 w-full rounded-lg overflow-hidden border border-[#2E2E34] bg-[#18181C]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />

      {/* Glowing effect for target key */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        {Object.entries(probabilities).map(([key, probability]) => {
          if (key === targetKey && probability > 0.5) {
            const index = Object.keys(probabilities).sort().indexOf(key)
            const totalKeys = Object.keys(probabilities).length
            const left = `calc(${(index / totalKeys) * 100}% + ${60 / totalKeys}%)`

            return (
              <div
                key={key}
                className="absolute w-1/4 h-full"
                style={{
                  left,
                  background: "radial-gradient(circle, rgba(0, 194, 255, 0.1) 0%, rgba(0, 194, 255, 0) 70%)",
                }}
              />
            )
          }
          return null
        })}
      </motion.div>
    </motion.div>
  )
}

export default ProbabilityChart
