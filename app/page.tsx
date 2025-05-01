"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, AlertTriangle, Lock, ChevronRight, Server, Cpu } from "lucide-react"
import QuantumCircuit from "@/components/quantum-circuit"
import ProbabilityChart from "@/components/probability-chart"
import SecurityPanel from "@/components/security-panel"
import KeyValueDisplay from "@/components/key-value-display"
import JobStatus from "@/components/job-status"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface QuantumSearchResult {
  dataset: Record<string, string>
  probabilities: Record<string, number>
  security_implications: string
  target_hash: string
  target_key: string
}

interface QuantumJob {
  job_id: string
  dataset: Record<string, string>
  target_key: string
  target_hash: string
  backend: string
  status: string
  probabilities?: Record<string, number>
  security_implications?: string
  created_at?: number
  completed_at?: number
  error?: string
}

const API_BASE_URL = "https://api.quantum-sgp.dhairyashah.dev"

export default function Home() {
  const [simulationData, setSimulationData] = useState<QuantumSearchResult | null>(null)
  const [jobData, setJobData] = useState<QuantumJob | null>(null)
  const [loading, setLoading] = useState(false)
  const [jobLoading, setJobLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("simulation")

  // Run simulation on page load
  const runSimulation = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/run_simulation`)
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const result = await response.json()
      setSimulationData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch simulation data")
      toast({
        title: "Simulation Error",
        description: err instanceof Error ? err.message : "Failed to fetch simulation data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Submit job to quantum hardware
  const submitQuantumJob = async () => {
    setJobLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/submit_quantum_job`)
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const result = await response.json()
      setJobData(result)
      setActiveTab("hardware")
      toast({
        title: "Job Submitted",
        description: `Quantum job submitted to ${result.backend}`,
      })
    } catch (err) {
      toast({
        title: "Submission Error",
        description: err instanceof Error ? err.message : "Failed to submit quantum job",
        variant: "destructive",
      })
    } finally {
      setJobLoading(false)
    }
  }

  // Check job status
  const checkJobStatus = useCallback(
    async (jobId: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/check_quantum_job/${jobId}`)
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        const result = await response.json()
        setJobData(result)

        // If job completed, show toast notification
        if (result.status === "completed" && jobData?.status !== "completed") {
          toast({
            title: "Job Completed",
            description: "Quantum hardware job has finished processing",
          })
        }

        return result.status
      } catch (err) {
        console.error("Error checking job status:", err)
        return "ERROR"
      }
    },
    [jobData?.status],
  )

  // Poll job status
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (jobData && jobData.job_id && jobData.status !== "completed" && jobData.status !== "ERROR") {
      intervalId = setInterval(async () => {
        const status = await checkJobStatus(jobData.job_id)
        if (status === "completed" || status === "ERROR") {
          clearInterval(intervalId)
        }
      }, 5000) // Check every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [jobData, checkJobStatus])

  // Run simulation on page load
  useEffect(() => {
    runSimulation()
  }, [runSimulation])

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans">
      {/* Header */}
      <motion.header
        className="border-b border-[#1E1E22] backdrop-blur-sm bg-[#0A0A0B]/90 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#00C2FF] to-[#8A2BE2] flex items-center justify-center shadow-lg shadow-[#00C2FF]/10">
              <Lock className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tight">Quantum Key Finder</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-xs font-normal text-[#8A8A93] border-[#2E2E34] px-1.5 py-0">
                  v2.0.0
                </Badge>
                <span className="text-xs text-[#8A8A93]">Grover's Algorithm</span>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={runSimulation}
              className="border-[#2E2E34] hover:border-[#4D4D56] hover:bg-[#1E1E22] text-[#E2E2E6] h-9 px-4 rounded-md transition-all duration-200 shadow-sm"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Cpu className="h-4 w-4 mr-2" />}
              Run Simulation
            </Button>

            <Button
              variant="default"
              onClick={submitQuantumJob}
              className="bg-gradient-to-r from-[#00C2FF] to-[#8A2BE2] hover:opacity-90 text-white h-9 px-4 rounded-md transition-all duration-200 shadow-sm"
              disabled={jobLoading}
            >
              {jobLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Server className="h-4 w-4 mr-2" />}
              Run on Quantum Hardware
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              className="p-4 rounded-lg bg-[#2D1215] border border-[#4E2025] text-[#F87171] flex items-center gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AlertTriangle className="h-5 w-5" />
              <p>Error: {error}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-[#18181C] border border-[#2E2E34]">
            <TabsTrigger value="simulation" className="data-[state=active]:bg-[#2E2E34] data-[state=active]:text-white">
              <Cpu className="h-4 w-4 mr-2" />
              Simulation
            </TabsTrigger>
            <TabsTrigger
              value="hardware"
              className="data-[state=active]:bg-[#2E2E34] data-[state=active]:text-white"
              disabled={!jobData}
            >
              <Server className="h-4 w-4 mr-2" />
              Quantum Hardware
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulation">
            {loading ? <LoadingState /> : simulationData ? <ResultsDisplay data={simulationData} /> : null}
          </TabsContent>

          <TabsContent value="hardware">
            {jobData ? (
              <>
                <JobStatus job={jobData} />
                {jobData.status === "completed" && jobData.probabilities ? (
                  <ResultsDisplay data={jobData as QuantumSearchResult} isHardware={true} />
                ) : (
                  <div className="p-8 text-center text-[#8A8A93]">
                    {jobData.status !== "ERROR" ? (
                      <p>Waiting for job completion to display results...</p>
                    ) : (
                      <p>Error processing job: {jobData.error}</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center text-[#8A8A93]">
                <p>No quantum hardware jobs submitted yet. Click "Run on Quantum Hardware" to start.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E1E22] py-6 mt-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[#8A8A93] text-sm">
              Quantum Key Finder — Visualizing Grover's Algorithm for cryptographic key search
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-[#8A8A93] hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
              >
                Documentation <ChevronRight className="h-3 w-3" />
              </a>
              <a
                href="#"
                className="text-[#8A8A93] hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
              >
                API Reference <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}

// Loading state component
const LoadingState = () => (
  <motion.div
    key="loading"
    className="space-y-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
          <h2 className="text-base font-medium mb-4 text-[#E2E2E6]">Quantum Circuit Visualization</h2>
          <Skeleton className="h-64 w-full bg-[#1E1E22]" />
        </Card>

        <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
          <h2 className="text-base font-medium mb-4 text-[#E2E2E6]">Probability Distribution</h2>
          <Skeleton className="h-64 w-full bg-[#1E1E22]" />
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
          <h2 className="text-base font-medium mb-4 text-[#E2E2E6]">Search Results</h2>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full bg-[#1E1E22]" />
            <Skeleton className="h-12 w-full bg-[#1E1E22]" />
            <Skeleton className="h-16 w-full bg-[#1E1E22]" />
          </div>
        </Card>

        <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
          <h2 className="text-base font-medium mb-4 text-[#E2E2E6]">Key-Value Dataset</h2>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full bg-[#1E1E22]" />
            ))}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
          <h2 className="text-base font-medium mb-4 text-[#E2E2E6]">Security Implications</h2>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-[#1E1E22]" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  </motion.div>
)

// Results display component
interface ResultsDisplayProps {
  data: QuantumSearchResult
  isHardware?: boolean
}

const ResultsDisplay = ({ data, isHardware = false }: ResultsDisplayProps) => (
  <motion.div
    key="data"
    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    initial="hidden"
    animate="show"
    exit={{ opacity: 0 }}
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    }}
  >
    {/* Left Column */}
    <motion.div
      className="lg:col-span-2 space-y-6"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00C2FF]/[0.03] to-[#8A2BE2]/[0.03]" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-[#E2E2E6]">Quantum Circuit Visualization</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-normal text-[#8A8A93] border-[#2E2E34] px-2">
              Grover's Algorithm
            </Badge>
            {isHardware && (
              <Badge className="text-xs font-normal bg-[#00C2FF] text-black px-2">Hardware Verified</Badge>
            )}
          </div>
        </div>
        <QuantumCircuit targetKey={data.target_key} />
      </Card>

      <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00C2FF]/[0.03] to-[#8A2BE2]/[0.03]" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-[#E2E2E6]">Probability Distribution</h2>
          <div className="flex items-center gap-1 text-xs text-[#8A8A93]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00C2FF]"></span>
            Target State
          </div>
        </div>
        <ProbabilityChart probabilities={data.probabilities} targetKey={data.target_key} />
      </Card>
    </motion.div>

    {/* Right Column */}
    <motion.div
      className="space-y-6"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00C2FF]/[0.03] to-[#8A2BE2]/[0.03]" />
        <h2 className="text-base font-medium mb-4 text-[#E2E2E6]">Search Results</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-md bg-[#18181C] border border-[#2E2E34]">
            <span className="text-[#8A8A93] text-sm">Target Key:</span>
            <span className="font-mono text-[#00C2FF] font-medium">{data.target_key}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-md bg-[#18181C] border border-[#2E2E34]">
            <span className="text-[#8A8A93] text-sm">Target Hash:</span>
            <span className="font-mono text-[#8A2BE2] font-medium">{data.target_hash}</span>
          </div>
          <div className="p-4 rounded-md bg-[#18181C] border border-[#2E2E34]">
            <h3 className="text-[#8A8A93] text-sm mb-2">Probability of Finding Target:</h3>
            <div className="text-2xl font-medium text-center text-[#00C2FF]">
              {(data.probabilities[data.target_key] * 100).toFixed(2)}%
            </div>
            <div className="w-full bg-[#2E2E34] h-1.5 rounded-full mt-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00C2FF] to-[#8A2BE2] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${data.probabilities[data.target_key] * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00C2FF]/[0.03] to-[#8A2BE2]/[0.03]" />
        <h2 className="text-base font-medium mb-4 text-[#E2E2E6]">Key-Value Dataset</h2>
        <KeyValueDisplay dataset={data.dataset} targetKey={data.target_key} />
      </Card>
    </motion.div>

    {/* Full Width */}
    <motion.div
      className="lg:col-span-3"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
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
        <SecurityPanel implications={data.security_implications} />
      </Card>
    </motion.div>
  </motion.div>
)
