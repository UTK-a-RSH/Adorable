"use client"

import { useState } from "react"
import { ExternalLink, RefreshCcw, Copy } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { Fragment } from "@/generated/prisma"

interface Props {
  data: Fragment
}

export const FragmentWeb = ({ data }: Props) => {
  const [key, setKey] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    setKey((prev) => prev + 1)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleOpenExternal = () => {
    window.open(data.sandboxurl, "_blank")
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(data.sandboxurl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  return (
    <motion.div
      className="flex flex-col w-full h-full bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-slate-200/60 shadow-xl overflow-hidden backdrop-blur-sm"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
    >
      {/* Header with address bar and controls */}
      <motion.div
        className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-b border-slate-200/60 backdrop-blur-md"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <motion.div
          className="flex-1 bg-gradient-to-r from-white to-slate-50/90 rounded-lg border-2 border-blue-200/60 px-3 py-2.5 shadow-lg backdrop-blur-sm cursor-pointer mr-4 relative overflow-hidden"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
            borderColor: "rgba(59, 130, 246, 0.4)",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={handleCopyUrl}
          animate={
            copied
              ? {
                  borderColor: "rgba(34, 197, 94, 0.6)",
                  backgroundColor: "rgba(34, 197, 94, 0.05)",
                }
              : {}
          }
          title={copied ? "URL copied!" : "Click to copy sandbox URL"}
        >
          {/* Active indicator gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5"
            animate={{
              background: copied
                ? "linear-gradient(to right, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.05))"
                : "linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05), rgba(6, 182, 212, 0.05))",
            }}
            transition={{ duration: 0.3 }}
          />

          <div className="flex items-center justify-between relative">
            <span className="text-sm text-slate-700 truncate block font-mono flex-1 pr-2">{data.sandboxurl}</span>

            <motion.div className="flex-shrink-0 ml-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <motion.div
                className={`p-1.5 rounded-md transition-colors duration-200 ${
                  copied ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
                animate={copied ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Copy className="h-3.5 w-3.5" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="h-9 w-9 p-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-200/40 rounded-lg transition-all duration-200"
              disabled={isLoading}
              title="Refresh the sandbox to reload the content"
            >
              <motion.div
                animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 1, repeat: isLoading ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
              >
                <RefreshCcw className="h-4 w-4 text-blue-600" />
              </motion.div>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenExternal}
              className="h-9 w-9 p-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-200/40 rounded-lg transition-all duration-200"
              title="Open sandbox in a new tab"
            >
              <ExternalLink className="h-4 w-4 text-emerald-600" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Loading bar */}
      {isLoading && (
        <motion.div
          className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      )}

      {/* Iframe container */}
      <motion.div
        className="flex-1 bg-white relative overflow-hidden rounded-b-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <motion.iframe
          key={key}
          className="w-full h-full border-0 rounded-b-xl"
          src={data.sandboxurl}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          title={`Sandbox: ${data.title}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        />

        {/* Subtle overlay for hover effects */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent pointer-events-none"
          whileHover={{
            background: "linear-gradient(to top, rgba(99, 102, 241, 0.02), transparent)",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  )
}
