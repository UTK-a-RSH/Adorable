"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { MessageCard } from "./message-card"
import { MessageForm } from "./message-form"
import { useEffect, useRef } from "react"
import type { Fragment } from "@/generated/prisma/wasm"
import { MessageLoading } from "./message-loading"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  projectId: string
  activeFragment: Fragment | null
  setActiveFragment: (fragment: Fragment | null) => void
}

export const MessageContainer = ({ projectId, activeFragment, setActiveFragment }: Props) => {
  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({
      projectId: projectId,
    })
  );

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage?.role === "USER";

  // Auto-scroll to newest message
  useEffect(() => {
    const lastAssistantMessage = messages.findLast((message) => message.role === "ASSISTANT" && !!message.fragment)
    if (!scrollRef.current || !bottomRef.current) return
    requestAnimationFrame(() => {
      try {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
      } catch {
        /* noop */
      }
      if (lastAssistantMessage && lastAssistantMessage.fragment) {
        setActiveFragment(lastAssistantMessage.fragment)
      }
    })
  }, [messages.length, messages, setActiveFragment])

  return (
    <motion.div
      className="flex flex-col h-full min-h-0 w-full relative bg-gradient-to-br from-background/80 via-background to-muted/20 dark:from-background/90 dark:via-background dark:to-muted/10 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary/3 dark:to-secondary/3 opacity-50" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)]"
        animate={{
          background: [
            "radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%)",
            "radial-gradient(circle_at_70%_60%,rgba(120,119,198,0.1),transparent_50%)",
            "radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Scrollable messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 relative z-10">
        <motion.div
          className="w-full px-4 pt-6 space-y-4 pb-36"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(4px)" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                className="hover:drop-shadow-lg transition-all duration-200"
              >
                <MessageCard
                  content={message.content}
                  role={message.role}
                  fragment={message.fragment}
                  createdAt={message.createdAt}
                  isActiveFragment={activeFragment?.id === message.fragment?.id}
                  onFragmentClick={() => setActiveFragment(message.fragment)}
                  type={message.type}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {isLastMessageUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                scale: { type: "spring", stiffness: 200, damping: 20 },
              }}
            >
              <MessageLoading />
            </motion.div>
          )}
          <div ref={bottomRef} />
        </motion.div>
        <div className="sticky bottom-0 h-24 -mb-24 bg-gradient-to-t from-background via-background/60 to-transparent dark:from-background dark:via-background/70 dark:to-transparent pointer-events-none z-20" />
      </div>

      {/* Form */}
      <motion.div
        className="flex-shrink-0 bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-2xl shadow-primary/5 dark:shadow-primary/10 relative z-30"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          transition: { duration: 0.2 },
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <motion.div
          className="w-full px-4 py-4"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <MessageForm projectId={projectId} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
