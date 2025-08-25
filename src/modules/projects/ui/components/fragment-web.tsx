"use client"

import { useState, useEffect } from "react"
import { ExternalLink, RefreshCcw, Copy, Globe, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Fragment } from "@/generated/prisma"

interface Props {
  data: Fragment
}

export const FragmentWeb = ({ data }: Props) => {
  const [key, setKey] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    setKey((prev) => prev + 1)
    setTimeout(() => setIsLoading(false), 1500)
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

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isFullscreen])

  return (
    <>
      <div
        className={`flex flex-col bg-background border border-border rounded-lg overflow-hidden ${
          isFullscreen
            ? "fixed inset-4 z-50 shadow-2xl"
            : "h-full"
        }`}
      >
        {/* Browser Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 border-b border-border">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>

          {/* Address Bar */}
          <div
            className={`flex-1 flex items-center gap-2 bg-background border border-border rounded-md px-3 py-1.5 cursor-pointer transition-colors hover:border-border/80 ${
              copied ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20" : ""
            }`}
            onClick={handleCopyUrl}
            title={copied ? "URL copied!" : "Click to copy URL"}
          >
            <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground font-mono truncate">
              {data.sandboxurl}
            </span>
            <Copy className={`w-3.5 h-3.5 flex-shrink-0 ${
              copied ? "text-green-600" : "text-muted-foreground"
            }`} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8 w-8 p-0"
              title="Refresh"
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8 p-0"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenExternal}
              className="h-8 w-8 p-0"
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading Progress */}
        {isLoading && (
          <div className="h-1 bg-muted overflow-hidden">
            <div className="h-full bg-primary animate-pulse" 
                 style={{ 
                   animation: "loading-bar 1.5s ease-in-out" 
                 }} 
            />
          </div>
        )}

        {/* Iframe Container */}
        <div className="flex-1 relative bg-white dark:bg-background">
          <iframe
            key={key}
            className="w-full h-full border-0"
            src={data.sandboxurl}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            title={`Preview: ${data.title || 'Untitled'}`}
          />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Loading preview...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Backdrop */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsFullscreen(false)}
        />
      )}

      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0% }
          50% { width: 60% }
          100% { width: 100% }
        }
      `}</style>
    </>
  )
}