/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server, Clock, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react"

interface JobStatusProps {
  job: {
    job_id: string
    backend: string
    status: string
    created_at?: number
    completed_at?: number
    error?: string
  }
}

const JobStatus: React.FC<JobStatusProps> = ({ job }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500"
      case "submitted":
      case "queued":
      case "running":
        return "bg-blue-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "submitted":
      case "queued":
      case "running":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp * 1000).toLocaleString()
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Job completed successfully"
      case "submitted":
        return "Job submitted to queue"
      case "queued":
        return "Job is queued on quantum hardware"
      case "running":
        return "Job is currently running on quantum hardware"
      case "error":
        return "Job encountered an error"
      default:
        return status
    }
  }

  const calculateDuration = () => {
    if (!job.created_at) return "N/A"
    if (job.completed_at) {
      const duration = job.completed_at - job.created_at
      return `${Math.floor(duration / 60)}m ${duration % 60}s`
    }
    const duration = Math.floor(Date.now() / 1000) - job.created_at
    return `${Math.floor(duration / 60)}m ${duration % 60}s (running)`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00C2FF]/[0.03] to-[#8A2BE2]/[0.03]" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-[#E2E2E6]">Quantum Hardware Job</h2>
          <Badge
            className={`text-xs font-normal text-white px-2 ${
              job.status.toLowerCase() === "completed"
                ? "bg-green-600"
                : job.status.toLowerCase() === "error"
                  ? "bg-red-600"
                  : "bg-blue-600"
            }`}
          >
            {job.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-md bg-[#18181C] border border-[#2E2E34]">
              <span className="text-[#8A8A93] text-sm">Job ID:</span>
              <span className="font-mono text-[#E2E2E6] text-sm truncate max-w-[200px]">{job.job_id}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-md bg-[#18181C] border border-[#2E2E34]">
              <span className="text-[#8A8A93] text-sm">Backend:</span>
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-[#00C2FF]" />
                <span className="font-mono text-[#E2E2E6]">{job.backend}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-md bg-[#18181C] border border-[#2E2E34]">
              <span className="text-[#8A8A93] text-sm">Submitted:</span>
              <span className="text-[#E2E2E6] text-sm">{formatDate(job.created_at)}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-md bg-[#18181C] border border-[#2E2E34]">
              <span className="text-[#8A8A93] text-sm">Duration:</span>
              <span className="text-[#E2E2E6] text-sm">{calculateDuration()}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-md bg-[#18181C] border border-[#2E2E34] flex items-center gap-3">
          {getStatusIcon(job.status)}
          <span className="text-[#E2E2E6]">{getStatusText(job.status)}</span>
          {job.error && <span className="text-red-400 text-sm ml-2">Error: {job.error}</span>}
        </div>

        {job.status.toLowerCase() === "completed" && (
          <div className="mt-4 p-3 rounded-md bg-[#182825] border border-[#2E4E34] text-green-400 text-sm">
            <p>
              Results from quantum hardware are now available. The visualization below shows the actual quantum
              computation results.
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default JobStatus
