"use client"

import { Button } from "@/components/ui/button"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { ExternalLink, FolderOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

export const ProjectsSidebar = () => {
  const trpc = useTRPC()
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions())

  return (
    <motion.div 
      className="w-80 h-screen bg-background/80 backdrop-blur-xl border-l border-border/60 shadow-xl relative overflow-hidden flex flex-col"
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:to-accent/10" />
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(var(--primary) / 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(var(--accent) / 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 20%, rgba(var(--primary) / 0.08) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between p-6 border-b border-border/50 backdrop-blur-sm flex-shrink-0"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h2 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Saved Projects
          </h2>
          <motion.span 
            className="text-xs text-muted-foreground px-2 py-1 bg-muted/40 backdrop-blur-sm rounded-full border border-border/40"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {projects?.length || 0}
          </motion.span>
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <AnimatePresence>
            {projects?.length === 0 ? (
              <motion.div 
                className="flex flex-col items-center justify-center h-full px-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1] 
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FolderOpen className="h-10 w-10 text-muted-foreground mb-4" />
                </motion.div>
                <p className="text-muted-foreground text-base mb-2 font-medium text-center">No projects yet</p>
                <p className="text-muted-foreground text-sm opacity-80 text-center leading-relaxed">
                  Start a conversation to create your first project
                </p>
              </motion.div>
            ) : (
              <div className="p-4 overflow-auto h-full">
                <div className="space-y-2">
                  {projects?.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: index * 0.05, 
                        duration: 0.4, 
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={`/projects/${project.id}`} className="block">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 group relative overflow-hidden">
                          {/* Hover gradient effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100"
                            transition={{ duration: 0.3 }}
                          />
                          
                          <motion.div 
                            className="flex-shrink-0 relative"
                            whileHover={{ rotate: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="p-1.5 bg-background/80 backdrop-blur-sm rounded-md border border-border/60 shadow-sm">
                              <Image
                                src="/logo.svg"
                                alt=""
                                width={20}
                                height={20}
                                className="rounded"
                              />
                            </div>
                          </motion.div>
                          
                          <div className="flex-1 min-w-0 relative z-10">
                            <div className="flex items-center gap-1 mb-0.5">
                              <h3 className="font-medium text-sm text-foreground truncate">
                                {project.name}
                              </h3>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              </motion.div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}