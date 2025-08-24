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
  const trpc = useTRPC()
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({
      projectId: projectId,
    }),
  )

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const lastMessage = messages[messages.length - 1]
  const isLastMessageUser = lastMessage?.role === "USER"

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
      className="flex flex-col h-full min-h-0 w-full relative bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scrollable messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <div className="w-full px-4 pt-6 space-y-4 pb-36">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                whileHover={{ scale: 1.01 }}
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MessageLoading />
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="sticky bottom-0 h-20 -mb-20 bg-gradient-to-t from-white via-blue-50/40 to-transparent pointer-events-none" />
      </div>
      {/* Form */}
      <motion.div
        className="flex-shrink-0 bg-gradient-to-r from-white/95 via-blue-50/80 to-purple-50/60 backdrop-blur-xl border-t border-gradient-to-r z-10 shadow-lg"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="w-full px-4 py-4">
          <MessageForm projectId={projectId} />
        </div>
      </motion.div>
    </motion.div>
  )
}
