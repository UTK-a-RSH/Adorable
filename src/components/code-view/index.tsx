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
import "prismjs/components/prism-bash"
import "prismjs/components/prism-python"
import "prismjs/components/prism-sql"
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg",
        "hover:shadow-xl transition-all duration-300",
        "dark:border-slate-700 dark:bg-slate-900",
        isExpanded ? "fixed inset-4 z-50 shadow-2xl" : "min-h-[200px]",
        className,
      )}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex-shrink-0 dark:from-slate-800 dark:to-slate-800 dark:border-slate-700"
        layout="position"
      >
        <div className="flex items-center gap-3">
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0 rounded-full hover:bg-white/60 transition-colors duration-200 dark:hover:bg-slate-700"
            >
              <motion.div 
                animate={{ rotate: isCollapsed ? 0 : 90 }} 
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </Button>
          )}

          {/* Language badge */}
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-3 h-3 rounded-full bg-emerald-500 shadow-md" 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider dark:text-slate-300">
              {language}
            </span>
            {title && (
              <>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">{title}</span>
              </>
            )}
            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full dark:text-slate-400 dark:bg-slate-700">
              {lineCount} lines
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.1 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 px-3 text-xs hover:bg-white/60 transition-all duration-200 dark:hover:bg-slate-700"
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4 mr-1" />
            ) : (
              <Maximize2 className="h-4 w-4 mr-1" />
            )}
            {isExpanded ? "Minimize" : "Expand"}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 px-3 text-xs hover:bg-white/60 opacity-70 group-hover:opacity-100 transition-all duration-200 dark:hover:bg-slate-700"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-600 font-medium">Copied!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
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
              transition: { duration: 0.3, ease: "easeInOut" }
            }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-1 overflow-hidden"
          >
            <motion.div
              className="relative h-full overflow-auto"
              style={{ height: getCodeHeight() }}
              layout
            >
              <pre className="relative m-0 p-0 bg-transparent h-full">
                <div className="flex h-full">
                  {/* Line numbers */}
                  {showLineNumbers && (
                    <motion.div 
                      className="flex-shrink-0 select-none px-4 py-4 text-right text-sm text-slate-500 bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 min-w-[4rem] font-mono dark:from-slate-800 dark:to-slate-850 dark:border-slate-700 dark:text-slate-400"
                      layout
                    >
                      {lines.map((_, index) => (
                        <div key={index + 1} className="leading-6 h-6">
                          {index + 1}
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Code content */}
                  <motion.div 
                    className="flex-1 overflow-auto"
                    layout
                  >
                    <code
                      ref={codeRef}
                      className="block px-4 py-4 font-mono text-sm leading-6 h-full"
                      style={{
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', monospace",
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="min-h-full"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightedCode.replace(
                            // Enhanced syntax highlighting with Tailwind classes
                            /(<span class="token )([^"]+)(">[^<]*<\/span>)/g,
                            (match, prefix, tokenType, suffix) => {
                              const colorMap: Record<string, string> = {
                                'comment': 'text-slate-500 italic',
                                'prolog': 'text-slate-500',
                                'doctype': 'text-slate-500',
                                'cdata': 'text-slate-500',
                                'punctuation': 'text-slate-700 dark:text-slate-300',
                                'property': 'text-blue-600 dark:text-blue-400',
                                'tag': 'text-blue-600 dark:text-blue-400',
                                'boolean': 'text-orange-600 dark:text-orange-400',
                                'number': 'text-orange-600 dark:text-orange-400',
                                'constant': 'text-orange-600 dark:text-orange-400',
                                'symbol': 'text-blue-600 dark:text-blue-400',
                                'selector': 'text-green-700 dark:text-green-400',
                                'attr-name': 'text-violet-600 dark:text-violet-400',
                                'string': 'text-green-700 dark:text-green-400',
                                'char': 'text-green-700 dark:text-green-400',
                                'builtin': 'text-cyan-600 dark:text-cyan-400',
                                'operator': 'text-pink-600 dark:text-pink-400',
                                'entity': 'text-pink-600 dark:text-pink-400',
                                'url': 'text-blue-600 dark:text-blue-400 underline',
                                'atrule': 'text-pink-600 dark:text-pink-400',
                                'attr-value': 'text-green-700 dark:text-green-400',
                                'keyword': 'text-pink-600 dark:text-pink-400 font-semibold',
                                'function': 'text-violet-600 dark:text-violet-400',
                                'class-name': 'text-yellow-600 dark:text-yellow-400',
                                'regex': 'text-red-600 dark:text-red-400',
                                'important': 'text-red-600 dark:text-red-400 font-bold',
                                'variable': 'text-blue-600 dark:text-blue-400',
                              }
                              const classes = colorMap[tokenType] || 'text-slate-700 dark:text-slate-300'
                              return `${prefix}${tokenType}" style="color: inherit" class="${classes}${suffix}`
                            }
                          )
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
            className="px-4 py-3 text-sm text-slate-600 bg-slate-50 border-t border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <span>{lineCount} lines collapsed</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(false)}
                className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </motion.div>
  )
}