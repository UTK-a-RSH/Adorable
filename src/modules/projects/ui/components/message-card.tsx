"use client"

import { type Fragment, MessageRole, MessageType } from "@/generated/prisma"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { ChevronRightIcon, Code2Icon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MessageCardProps {
  content: string
  role: MessageRole
  fragment: Fragment | null
  createdAt: Date
  isActiveFragment: boolean
  onFragmentClick: (fragment: Fragment | null) => void
  type: MessageType
}

interface UserMessageProps {
  content: string
}

interface AssistantMessageProps {
  content: string
  fragment: Fragment | null
  createdAt: Date
  isActiveFragment: boolean
  onFragmentClick: (fragment: Fragment | null) => void
  type: MessageType
}

interface FragmentCardProps {
  fragment: Fragment | null
  isActive: boolean
  onClick: (fragment: Fragment | null) => void
}

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <motion.div
      className="flex justify-end pb-4 pr-2 pl-10"
      initial={{ opacity: 0, x: 20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-[80%]">
        <motion.div
          className="flex items-center justify-end gap-2 mb-1 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span className="font-medium">You</span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Card
            className="rounded-lg bg-primary text-primary-foreground p-3 shadow-sm border-primary/20 break-words 
            transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 relative overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 
            before:transition-opacity before:duration-300 hover:before:opacity-100
          "
          >
            <div className="text-sm relative z-10">{content}</div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

const AssistantMessage = ({
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: AssistantMessageProps) => {
  const formattedDate = new Date(createdAt).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    month: "short",
    day: "numeric",
  })

  return (
    <motion.div
      className="flex justify-start pb-4 pl-2 pr-10"
      initial={{ opacity: 0, x: -20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-[80%]">
        <motion.div
          className="flex items-center gap-2 mb-1 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
              <Image src="/logo.svg" alt="Logo" width={100} height={40} className="shrink-0" priority />
            </motion.div>
          </div>
          <span>{formattedDate}</span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Card
            className="rounded-lg bg-card text-card-foreground p-3 shadow-sm border break-words 
            transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 relative overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 
            before:transition-opacity before:duration-300 hover:before:opacity-100
          "
          >
            <div className="text-sm relative z-10">{content}</div>
            {type === MessageType.RESULT && (
              <FragmentCard fragment={fragment} isActive={isActiveFragment} onClick={onFragmentClick} />
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

const FragmentCard = ({ fragment, isActive, onClick }: FragmentCardProps) => {
  if (!fragment) return null

  return (
    <motion.button
      type="button"
      aria-pressed={isActive}
      onClick={() => onClick(fragment)}
      className={`mt-3 w-full text-left group relative overflow-hidden rounded-lg border p-3 text-xs
        transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2
        hover:shadow-md active:shadow-sm
        before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:via-primary/10 before:to-transparent 
        before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100
        ${
          isActive
            ? "bg-primary/10 border-primary/30 shadow-inner ring-1 ring-primary/20"
            : "bg-card border-border hover:border-primary/30 hover:bg-primary/5"
        }`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-start gap-2">
          <motion.span
            className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md transition-all duration-300 ring-1 ring-inset
              ${
                isActive
                  ? "bg-primary text-primary-foreground ring-primary/30"
                  : "bg-primary/10 text-primary ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground"
              }`}
            whileHover={{ scale: 1.1, rotate: 6 }}
            transition={{ duration: 0.2 }}
          >
            <Code2Icon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6" />
          </motion.span>
          <div>
            <div className="font-medium text-foreground line-clamp-2 transition-colors duration-200 group-hover:text-primary">
              {fragment.title}
            </div>
            <div className="mt-1 text-muted-foreground transition-colors duration-200 group-hover:text-foreground/80">
              Sandbox: <span className="font-mono text-[10px] break-all">{fragment.sandboxurl}</span>
            </div>
          </div>
        </div>
        <motion.div whileHover={{ x: 2, scale: 1.1 }} transition={{ duration: 0.2 }}>
          <ChevronRightIcon className="mt-1 h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:text-primary" />
        </motion.div>
      </div>
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="mt-2 flex items-center gap-1 text-[10px] font-medium text-primary"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
            Active fragment
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: MessageCardProps) => {
  if (role === MessageRole.USER) {
    return <UserMessage content={content} />
  }

  return (
    <AssistantMessage
      content={content}
      fragment={fragment}
      createdAt={createdAt}
      isActiveFragment={isActiveFragment}
      onFragmentClick={onFragmentClick}
      type={type}
    />
  )
}
