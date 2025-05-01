/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Server, Calendar, Hash, Key } from "lucide-react"
import JobStatus from "@/components/job-status"
import QuantumCircuit from "@/components/quantum-circuit"
import ProbabilityChart from "@/components/probability-chart"
import SecurityPanel from "@/components/security-panel"
import KeyValueDisplay from "@/components/key-value-display"

interface JobDetailsProps {
  job: {
    job_id: string
    backend: string
    status: string
    created_at: number
    completed_at?: number
    dataset: Record<string, string>
    target_key: string
    target_hash: string
    probabilities?: Record<string, number>
    security_implications?: string
    error?: string
  }
}

const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  // Calculate duration
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      {/* Job Status Card */}
      <JobStatus job={job} />

      {/* Job Results */}
      {job.status.toLowerCase() === "completed" && job.probabilities ? (
        <Tabs defaultValue="results" className="w-full">
          <TabsList className="bg-[#18181C] border border-[#2E2E34] mb-4">
            <TabsTrigger value="results" className="data-[state=active]:bg-[#2E2E34] data-[state=active]:text-white">
              Results
            </TabsTrigger>
            <TabsTrigger value="circuit" className="data-[state=active]:bg-[#2E2E34] data-[state=active]:text-white">
              Quantum Circuit
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-[#2E2E34] data-[state=active]:text-white">
              Security Implications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00C2FF]/[0.03] to-[#8A2BE2]/[0.03]" />
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-medium text-[#E2E2E6]">Probability Distribution</h2>
                <div className="flex items-center gap-1 text-xs text-[#8A8A93]">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#00C2FF]"></span>
                  Target State
                </div>
              </div>
              <ProbabilityChart probabilities={job.probabilities} targetKey={job.target_key} />
            </Card>

            <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00C2FF]/[0.03] to-[#8A2BE2]/[0.03]" />
              <h2 className="text-base font-medium mb-4 text-[#E2E2E6]">Search Results</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-md bg-[#18181C] border border-[#2E2E34]">
                  <span className="text-[#8A8A93] text-sm">Target Key:</span>
                  <span className="font-mono text-[#00C2FF] font-medium">{job.target_key}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-md bg-[#18181C] border border-[#2E2E34]">
                  <span className="text-[#8A8A93] text-sm">Target Hash:</span>
                  <span className="font-mono text-[#8A2BE2] font-medium">{job.target_hash}</span>
                </div>
                <div className="p-4 rounded-md bg-[#18181C] border border-[#2E2E34]">
                  <h3 className="text-[#8A8A93] text-sm mb-2">Probability of Finding Target:</h3>
                  <div className="text-2xl font-medium text-center text-[#00C2FF]">
                    {(job.probabilities[job.target_key] * 100).toFixed(2)}%
                  </div>
                  <div className="w-full bg-[#2E2E34] h-1.5 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#00C2FF] to-[#8A2BE2] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${job.probabilities[job.target_key] * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00C2FF]/[0.03] to-[#8A2BE2]/[0.03]" />
              <h2 className="text-base font-medium mb-4 text-[#E2E2E6]">Key-Value Dataset</h2>
              <KeyValueDisplay dataset={job.dataset} targetKey={job.target_key} />
            </Card>
          </TabsContent>

          <TabsContent value="circuit">
            <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00C2FF]/[0.03] to-[#8A2BE2]/[0.03]" />
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-medium text-[#E2E2E6]">Quantum Circuit Visualization</h2>
                <Badge variant="outline" className="text-xs font-normal text-[#8A8A93] border-[#2E2E34] px-2">
                  Grover&apos;s Algorithm
                </Badge>
              </div>
              <QuantumCircuit targetKey={job.target_key} />
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00C2FF]/[0.03] to-[#8A2BE2]/[0.03]" />
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-medium text-[#E2E2E6]">Security Implications</h2>
                <Badge
                  variant="outline"
                  className="text-xs font-normal text-amber-400 border-amber-900/50 bg-amber-950/20 px-2"
                >
                  Security Alert
                </Badge>
              </div>
              {job.security_implications ? (
                <SecurityPanel implications={job.security_implications} />
              ) : (
                <div className="p-4 text-[#8A8A93]">No security implications available</div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        // Job is not completed yet
        <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00C2FF]/[0.03] to-[#8A2BE2]/[0.03]" />
          <h2 className="text-base font-medium mb-4 text-[#E2E2E6]">Job Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-md bg-[#18181C] border border-[#2E2E34]">
                <span className="text-[#8A8A93] text-sm flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Target Key:
                </span>
                <span className="font-mono text-[#00C2FF] font-medium">{job.target_key}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-md bg-[#18181C] border border-[#2E2E34]">
                <span className="text-[#8A8A93] text-sm flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Target Hash:
                </span>
                <span className="font-mono text-[#8A2BE2] font-medium">{job.target_hash}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-md bg-[#18181C] border border-[#2E2E34]">
                <span className="text-[#8A8A93] text-sm flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Backend:
                </span>
                <span className="font-mono text-[#E2E2E6]">{job.backend}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-md bg-[#18181C] border border-[#2E2E34]">
                <span className="text-[#8A8A93] text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Submitted:
                </span>
                <span className="text-[#E2E2E6] text-sm">{formatDate(job.created_at)}</span>
              </div>
            </div>
          </div>

          {job.error && (
            <div className="mt-4 p-4 rounded-md bg-[#2D1215] border border-[#4E2025] text-[#F87171]">
              <h3 className="font-medium mb-2">Error</h3>
              <p className="text-sm">{job.error}</p>
            </div>
          )}
        </Card>
      )}
    </motion.div>
  )
}

export default JobDetails
