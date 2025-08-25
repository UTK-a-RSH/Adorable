"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check, ChevronRight, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Prism from "prismjs"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-json"
import "./code-theme.css"


interface EnhancedCodeViewProps {
  code: string
  language: string
  title?: string
  showLineNumbers?: boolean
  collapsible?: boolean
  maxHeight?: string
  className?: string
}

export const CodeView: React.FC<EnhancedCodeViewProps> = ({
  code,
  language,
  title,
  showLineNumbers = true,
  collapsible = false,
  maxHeight,
  className,
}) => {
  const [copied, setCopied] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [highlightedCode, setHighlightedCode] = useState("")
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const highlighted = Prism.highlight(code, Prism.languages[language] || Prism.languages.text, language)
      setHighlightedCode(highlighted)
    }
  }, [code, language])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const lines = code.split("\n")
  const lineCount = lines.length

  // Dynamic height calculation
  const getCodeHeight = () => {
    if (isExpanded) return "80vh"
    if (maxHeight) return maxHeight

    // Auto-adjust based on content and screen size
    const baseHeight = Math.min(lineCount * 24 + 32, window.innerHeight * 0.6)
    const minHeight = 200
    return `${Math.max(baseHeight, minHeight)}px`
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-lg",
        "hover:shadow-xl transition-all duration-500 ease-out",
        "border-border backdrop-blur-sm",
        "hover:shadow-primary/5 hover:border-primary/20",
        isExpanded ? "fixed inset-4 z-50 shadow-2xl" : "min-h-[200px]",
        className,
      )}
      whileHover={{
        y: -2,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
    >
      {/* Header */}
      <motion.div
        className={cn(
          "flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border flex-shrink-0",
          "backdrop-blur-sm",
        )}
        layout="position"
      >
        <div className="flex items-center gap-3">
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn("h-8 w-8 p-0 rounded-full transition-all duration-300", "hover:bg-accent hover:scale-110")}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 0 : 90 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </Button>
          )}

          {/* Language badge */}
          <div className="flex items-center gap-3">
            <motion.div
              className="w-3 h-3 rounded-full bg-emerald-500 shadow-md"
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 0 0 rgba(16, 185, 129, 0.4)",
                  "0 0 0 8px rgba(16, 185, 129, 0)",
                  "0 0 0 0 rgba(16, 185, 129, 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">{language}</span>
            {title && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{title}</span>
              </>
            )}
            <motion.span
              className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full font-medium"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {lineCount} lines
            </motion.span>
          </div>
        </div>

        {/* Action buttons */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn("h-8 px-3 text-xs transition-all duration-300", "hover:bg-accent hover:scale-105")}
          >
            <motion.div whileHover={{ rotate: 5 }} transition={{ duration: 0.2 }}>
              {isExpanded ? <Minimize2 className="h-4 w-4 mr-1" /> : <Maximize2 className="h-4 w-4 mr-1" />}
            </motion.div>
            {isExpanded ? "Minimize" : "Expand"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className={cn(
              "h-8 px-3 text-xs transition-all duration-300",
              "hover:bg-accent opacity-70 group-hover:opacity-100 hover:scale-105",
            )}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-center gap-1"
                >
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-600 font-medium">Copied!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </motion.div>

      {/* Code content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1],
                staggerChildren: 0.1,
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { duration: 0.3 },
            }}
            className="flex-1 overflow-hidden"
          >
            <motion.div
              className="relative h-full overflow-auto"
              style={{ height: getCodeHeight() }}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <pre className="relative m-0 p-0 bg-transparent h-full">
                <div className="flex h-full">
                  {/* Line numbers */}
                  {showLineNumbers && (
                    <motion.div
                      className={cn(
                        "flex-shrink-0 select-none px-4 py-4 text-right text-sm min-w-[4rem] font-mono",
                        "text-muted-foreground bg-muted/30 border-r border-border",
                      )}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      {lines.map((_, index) => (
                        <motion.div
                          key={index + 1}
                          className="leading-6 h-6 hover:text-foreground transition-colors duration-200"
                          whileHover={{ scale: 1.05 }}
                        >
                          {index + 1}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Code content */}
                  <motion.div
                    className="flex-1 overflow-auto"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <code
                      ref={codeRef}
                      className="block px-4 py-4 font-mono text-sm leading-6 h-full text-foreground"
                      style={{
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', monospace",
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="min-h-full"
                        dangerouslySetInnerHTML={{
                          __html: highlightedCode.replace(
                            /(<span class="token )([^"]+)(">[^<]*<\/span>)/g,
                            (match, prefix, tokenType, suffix) => {
                              const colorMap: Record<string, string> = {
                                comment: "text-muted-foreground italic opacity-75",
                                prolog: "text-muted-foreground",
                                doctype: "text-muted-foreground",
                                cdata: "text-muted-foreground",
                                punctuation: "text-foreground/80",
                                property: "text-blue-600 dark:text-blue-400",
                                tag: "text-blue-600 dark:text-blue-400",
                                boolean: "text-orange-600 dark:text-orange-400",
                                number: "text-orange-600 dark:text-orange-400",
                                constant: "text-orange-600 dark:text-orange-400",
                                symbol: "text-blue-600 dark:text-blue-400",
                                selector: "text-green-700 dark:text-green-400",
                                "attr-name": "text-violet-600 dark:text-violet-400",
                                string: "text-green-700 dark:text-green-400",
                                char: "text-green-700 dark:text-green-400",
                                builtin: "text-cyan-600 dark:text-cyan-400",
                                operator: "text-pink-600 dark:text-pink-400",
                                entity: "text-pink-600 dark:text-pink-400",
                                url: "text-blue-600 dark:text-blue-400 underline",
                                atrule: "text-pink-600 dark:text-pink-400",
                                "attr-value": "text-green-700 dark:text-green-400",
                                keyword: "text-pink-600 dark:text-pink-400 font-semibold",
                                function: "text-violet-600 dark:text-violet-400",
                                "class-name": "text-yellow-600 dark:text-yellow-400",
                                regex: "text-red-600 dark:text-red-400",
                                important: "text-red-600 dark:text-red-400 font-bold",
                                variable: "text-blue-600 dark:text-blue-400",
                              }
                              const classes = colorMap[tokenType] || "text-foreground"
                              return `${prefix}${tokenType}" style="color: inherit" class="${classes}${suffix}`
                            },
                          ),
                        }}
                      />
                    </code>
                  </motion.div>
                </div>
              </pre>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed state indicator */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={cn("px-4 py-3 text-sm border-t", "text-muted-foreground bg-muted/30 border-border")}
          >
            <div className="flex items-center justify-between">
              <span>{lineCount} lines collapsed</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(false)}
                className={cn(
                  "text-xs transition-all duration-300",
                  "text-primary hover:text-primary/80 hover:bg-primary/10 hover:scale-105",
                )}
              >
                Show code
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded state overlay */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </motion.div>
  )
}
