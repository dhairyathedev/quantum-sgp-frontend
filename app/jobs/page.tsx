/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Loader2,
  AlertTriangle,
  RefreshCw,
  Server,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import JobDetails from "@/components/job-details"

interface QuantumJob {
  job_id: string
  dataset: Record<string, string>
  target_key: string
  target_hash: string
  backend: string
  status: string
  created_at: number
  completed_at?: number
  probabilities?: Record<string, number>
  security_implications?: string
  error?: string
}

const API_BASE_URL = "https://api.quantum-sgp.dhairyashah.dev"

export default function JobsPage() {
  const [jobs, setJobs] = useState<QuantumJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<QuantumJob | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch all jobs
  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/list_quantum_jobs`)
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()
      setJobs(data.jobs || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch jobs")
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to fetch jobs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch job details
  const fetchJobDetails = useCallback(async (jobId: string) => {
    try {
      console.log("Fetching job details for:", jobId)
      const response = await fetch(`${API_BASE_URL}/job_details/${jobId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
      })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()
      console.log("Job details received:", data)
      setSelectedJob(data)
      return data
    } catch (err) {
      console.error("Error fetching job details:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to fetch job details",
        variant: "destructive",
      })
      return null
    }
  }, [])

  // Handle job selection
  const handleJobSelect = useCallback(async (jobId: string) => {
    console.log("Job selected:", jobId)
    await fetchJobDetails(jobId)
  }, [fetchJobDetails])

  // Handle refresh button click
  const handleRefresh = () => {
    setLoading(true)
    fetchJobs()
    toast({
      title: "Refreshed",
      description: "Job list has been updated",
    })
  }

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(
    (job) =>
      job.job_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.backend.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-600"
      case "error":
        return "bg-red-600"
      case "running":
        return "bg-blue-600"
      case "queued":
        return "bg-yellow-600"
      default:
        return "bg-gray-600"
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "queued":
        return <Clock className="h-4 w-4" />
      default:
        return <Server className="h-4 w-4" />
    }
  }

  // Initial fetch and periodic updates
  useEffect(() => {
    fetchJobs()

    // Set up polling every 3 seconds
    const intervalId = setInterval(() => {
      fetchJobs()
    }, 3000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [fetchJobs])

  // Update selected job details if it's already selected
  useEffect(() => {
    if (selectedJob) {
      const updatedJob = jobs.find((job) => job.job_id === selectedJob.job_id)
      if (updatedJob && updatedJob.status !== selectedJob.status) {
        fetchJobDetails(selectedJob.job_id)
      }
    }
  }, [jobs, selectedJob, fetchJobDetails])

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
              <Server className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tight">Quantum Jobs Dashboard</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-xs font-normal text-[#8A8A93] border-[#2E2E34] px-1.5 py-0">
                  v2.0.0
                </Badge>
                <span className="text-xs text-[#8A8A93]">Job Management</span>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="outline"
                className="border-[#2E2E34] hover:border-[#4D4D56] hover:bg-[#1E1E22] text-[#E2E2E6] h-9 px-4 rounded-md transition-all duration-200 shadow-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <Button
              variant="default"
              onClick={handleRefresh}
              className="bg-gradient-to-r from-[#00C2FF] to-[#8A2BE2] hover:opacity-90 text-white h-9 px-4 rounded-md transition-all duration-200 shadow-sm"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh Jobs
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jobs List */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00C2FF]/[0.03] to-[#8A2BE2]/[0.03]" />
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-medium text-[#E2E2E6]">Quantum Jobs</h2>
                <Badge variant="outline" className="text-xs font-normal text-[#8A8A93] border-[#2E2E34] px-2">
                  {jobs.length} Jobs
                </Badge>
              </div>

              <div className="mb-4 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8A8A93]" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-[#18181C] border-[#2E2E34] text-[#E2E2E6] placeholder:text-[#8A8A93]"
                />
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                {loading ? (
                  // Loading skeletons
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="p-3 rounded-md bg-[#18181C] border border-[#2E2E34]">
                        <Skeleton className="h-5 w-3/4 bg-[#2E2E34] mb-2" />
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-1/3 bg-[#2E2E34]" />
                          <Skeleton className="h-4 w-1/4 bg-[#2E2E34]" />
                        </div>
                      </div>
                    ))
                ) : filteredJobs.length > 0 ? (
                  // Job list
                  filteredJobs.map((job) => (
                    <motion.div
                      key={job.job_id}
                      className={`p-3 rounded-md border cursor-pointer transition-all duration-200 ${
                        selectedJob?.job_id === job.job_id
                          ? "bg-[#1E1E22] border-[#00C2FF]"
                          : "bg-[#18181C] border-[#2E2E34] hover:border-[#4D4D56]"
                      }`}
                      onClick={() => {
                        console.log("Direct job click:", job.job_id);
                        
                        // Show loading state
                        setLoading(true);
                        
                        // Make the API call directly here
                        fetch(`${API_BASE_URL}/job_details/${job.job_id}`, {
                          method: 'GET',
                          headers: {
                            'Accept': 'application/json',
                            'Cache-Control': 'no-cache'
                          },
                        })
                        .then(response => {
                          if (!response.ok) {
                            throw new Error(`API error: ${response.status}`);
                          }
                          return response.json();
                        })
                        .then(data => {
                          console.log("Job details fetched:", data);
                          setSelectedJob(data);
                        })
                        .catch(err => {
                          console.error("Error in direct fetch:", err);
                          toast({
                            title: "Error",
                            description: err instanceof Error ? err.message : "Failed to fetch job details",
                            variant: "destructive",
                          });
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-sm text-[#E2E2E6] truncate max-w-[180px]">{job.job_id}</span>
                        <Badge className={`text-xs ${getStatusColor(job.status)} text-white`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(job.status)}
                            {job.status}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs">
                        <div className="flex items-center gap-1 text-[#8A8A93]">
                          <Server className="h-3 w-3" />
                          {job.backend}
                        </div>
                        <div className="flex items-center gap-1 text-[#8A8A93]">
                          <Calendar className="h-3 w-3" />
                          {new Date(job.created_at * 1000).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  // No jobs found
                  <div className="p-6 text-center text-[#8A8A93]">
                    <p>No jobs found</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Job Details */}
          <div className="lg:col-span-2 space-y-4">
            {selectedJob ? (
              <JobDetails job={selectedJob} />
            ) : (
              <Card className="p-6 bg-[#121214] border-[#1E1E22] overflow-hidden relative h-[400px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00C2FF]/[0.03] to-[#8A2BE2]/[0.03]" />
                <div className="text-center text-[#8A8A93]">
                  <Server className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <h3 className="text-lg font-medium mb-2">No Job Selected</h3>
                  <p>Select a job from the list to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E1E22] py-6 mt-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[#8A8A93] text-sm">
              Quantum Key Finder — Visualizing Grover&apos;s Algorithm for cryptographic key search
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
