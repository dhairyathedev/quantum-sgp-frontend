"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface QuantumCircuitProps {
  targetKey: string
}

const QuantumCircuit: React.FC<QuantumCircuitProps> = ({ targetKey }) => {
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
    ctx.strokeStyle = "#2E2E34"
    ctx.lineWidth = 1
    ctx.font = "12px Inter, system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Draw circuit
    const margin = 40
    const width = rect.width - 2 * margin
    const height = rect.height - 2 * margin
    const qubitSpacing = height / 3

    // Draw qubit lines
    for (let i = 0; i < 2; i++) {
      const y = margin + qubitSpacing * (i + 1)

      // Qubit line
      ctx.beginPath()
      ctx.moveTo(margin, y)
      ctx.lineTo(margin + width, y)
      ctx.stroke()

      // Qubit label
      ctx.fillStyle = "#8A8A93"
      ctx.fillText(`q${i}`, margin - 20, y)
    }

    // Draw H gates (Hadamard)
    const gateWidth = 30
    for (let i = 0; i < 2; i++) {
      const y = margin + qubitSpacing * (i + 1)
      const x = margin + width * 0.15

      ctx.fillStyle = "rgba(0, 194, 255, 0.1)"
      ctx.fillRect(x - gateWidth / 2, y - gateWidth / 2, gateWidth, gateWidth)

      ctx.strokeStyle = "#00C2FF"
      ctx.strokeRect(x - gateWidth / 2, y - gateWidth / 2, gateWidth, gateWidth)

      ctx.fillStyle = "#E2E2E6"
      ctx.fillText("H", x, y)
    }

    // Draw Oracle (controlled-Z with potential X gates)
    const oracleX = margin + width * 0.4

    // Draw X gates if needed based on target key
    for (let i = 0; i < 2; i++) {
      if (targetKey[i] === "0") {
        const y = margin + qubitSpacing * (i + 1)
        const x = oracleX - 40

        ctx.fillStyle = "rgba(138, 43, 226, 0.1)"
        ctx.fillRect(x - gateWidth / 2, y - gateWidth / 2, gateWidth, gateWidth)

        ctx.strokeStyle = "#8A2BE2"
        ctx.strokeRect(x - gateWidth / 2, y - gateWidth / 2, gateWidth, gateWidth)

        ctx.fillStyle = "#E2E2E6"
        ctx.fillText("X", x, y)
      }
    }

    // Draw controlled-Z
    const y1 = margin + qubitSpacing * 1
    const y2 = margin + qubitSpacing * 2

    // Vertical line connecting qubits
    ctx.beginPath()
    ctx.moveTo(oracleX, y1)
    ctx.lineTo(oracleX, y2)
    ctx.strokeStyle = "#00C2FF"
    ctx.stroke()

    // Control points
    ctx.fillStyle = "#00C2FF"
    ctx.beginPath()
    ctx.arc(oracleX, y1, 4, 0, Math.PI * 2)
    ctx.fill()

    // Target point (Z gate)
    ctx.fillStyle = "rgba(0, 194, 255, 0.1)"
    ctx.fillRect(oracleX - gateWidth / 2, y2 - gateWidth / 2, gateWidth, gateWidth)

    ctx.strokeStyle = "#00C2FF"
    ctx.strokeRect(oracleX - gateWidth / 2, y2 - gateWidth / 2, gateWidth, gateWidth)

    ctx.fillStyle = "#E2E2E6"
    ctx.fillText("Z", oracleX, y2)

    // Draw X gates again if needed
    for (let i = 0; i < 2; i++) {
      if (targetKey[i] === "0") {
        const y = margin + qubitSpacing * (i + 1)
        const x = oracleX + 40

        ctx.fillStyle = "rgba(138, 43, 226, 0.1)"
        ctx.fillRect(x - gateWidth / 2, y - gateWidth / 2, gateWidth, gateWidth)

        ctx.strokeStyle = "#8A2BE2"
        ctx.strokeRect(x - gateWidth / 2, y - gateWidth / 2, gateWidth, gateWidth)

        ctx.fillStyle = "#E2E2E6"
        ctx.fillText("X", x, y)
      }
    }

    // Draw diffuser
    const diffuserX = margin + width * 0.7

    // Draw H gates
    for (let i = 0; i < 2; i++) {
      const y = margin + qubitSpacing * (i + 1)
      const x = diffuserX - 60

      ctx.fillStyle = "rgba(0, 194, 255, 0.1)"
      ctx.fillRect(x - gateWidth / 2, y - gateWidth / 2, gateWidth, gateWidth)

      ctx.strokeStyle = "#00C2FF"
      ctx.strokeRect(x - gateWidth / 2, y - gateWidth / 2, gateWidth, gateWidth)

      ctx.fillStyle = "#E2E2E6"
      ctx.fillText("H", x, y)
    }

    // Draw X gates
    for (let i = 0; i < 2; i++) {
      const y = margin + qubitSpacing * (i + 1)
      const x = diffuserX - 20

      ctx.fillStyle = "rgba(138, 43, 226, 0.1)"
      ctx.fillRect(x - gateWidth / 2, y - gateWidth / 2, gateWidth, gateWidth)

      ctx.strokeStyle = "#8A2BE2"
      ctx.strokeRect(x - gateWidth / 2, y - gateWidth / 2, gateWidth, gateWidth)

      ctx.fillStyle = "#E2E2E6"
      ctx.fillText("X", x, y)
    }

    // Draw controlled-Z for diffuser
    // Vertical line connecting qubits
    ctx.beginPath()
    ctx.moveTo(diffuserX, y1)
    ctx.lineTo(diffuserX, y2)
    ctx.strokeStyle = "#00C2FF"
    ctx.stroke()

    // Control points
    ctx.fillStyle = "#00C2FF"
    ctx.beginPath()
    ctx.arc(diffuserX, y1, 4, 0, Math.PI * 2)
    ctx.fill()

    // Target point (Z gate)
    ctx.fillStyle = "rgba(0, 194, 255, 0.1)"
    ctx.fillRect(diffuserX - gateWidth / 2, y2 - gateWidth / 2, gateWidth, gateWidth)

    ctx.strokeStyle = "#00C2FF"
    ctx.strokeRect(diffuserX - gateWidth / 2, y2 - gateWidth / 2, gateWidth, gateWidth)

    ctx.fillStyle = "#E2E2E6"
    ctx.fillText("Z", diffuserX, y2)

    // Draw X gates again
    for (let i = 0; i < 2; i++) {
      const y = margin + qubitSpacing * (i + 1)
      const x = diffuserX + 20

      ctx.fillStyle = "rgba(138, 43, 226, 0.1)"
      ctx.fillRect(x - gateWidth / 2, y - gateWidth / 2, gateWidth, gateWidth)

      ctx.strokeStyle = "#8A2BE2"
      ctx.strokeRect(x - gateWidth / 2, y - gateWidth / 2, gateWidth, gateWidth)

      ctx.fillStyle = "#E2E2E6"
      ctx.fillText("X", x, y)
    }

    // Draw H gates again
    for (let i = 0; i < 2; i++) {
      const y = margin + qubitSpacing * (i + 1)
      const x = diffuserX + 60

      ctx.fillStyle = "rgba(0, 194, 255, 0.1)"
      ctx.fillRect(x - gateWidth / 2, y - gateWidth / 2, gateWidth, gateWidth)

      ctx.strokeStyle = "#00C2FF"
      ctx.strokeRect(x - gateWidth / 2, y - gateWidth / 2, gateWidth, gateWidth)

      ctx.fillStyle = "#E2E2E6"
      ctx.fillText("H", x, y)
    }

    // Draw measurement
    const measureX = margin + width * 0.9
    for (let i = 0; i < 2; i++) {
      const y = margin + qubitSpacing * (i + 1)

      // Measurement box
      ctx.fillStyle = "rgba(0, 194, 255, 0.1)"
      ctx.fillRect(measureX - 15, y - 15, 30, 30)

      ctx.strokeStyle = "#00C2FF"
      ctx.strokeRect(measureX - 15, y - 15, 30, 30)

      // Measurement symbol
      ctx.beginPath()
      ctx.moveTo(measureX - 10, y - 10)
      ctx.lineTo(measureX + 10, y + 10)
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(measureX - 10, y - 10, 3, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw circuit label
    ctx.fillStyle = "#8A8A93"
    ctx.font = "12px Inter, system-ui, sans-serif"
    ctx.fillText("Oracle", oracleX, margin - 15)
    ctx.fillText("Diffuser", diffuserX, margin - 15)
    ctx.fillText("Measurement", measureX, margin - 15)
  }, [targetKey])

  return (
    <motion.div
      className="relative h-64 w-full rounded-lg overflow-hidden border border-[#2E2E34] bg-[#18181C]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#00C2FF]"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.3 + 0.1,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
              y: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
              opacity: [Math.random() * 0.3 + 0.1, Math.random() * 0.5 + 0.2, Math.random() * 0.3 + 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default QuantumCircuit
