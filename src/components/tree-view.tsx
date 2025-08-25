"use client"

import type { TreeItem } from "@/types"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

interface TreeViewProps {
  data: TreeItem[]
  value?: string | null
  onSelect?: (path: string) => void
}

export const TreeView = ({ data, value, onSelect }: TreeViewProps) => {
  return (
    <motion.div
      className="w-full h-full overflow-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="space-y-0.5 p-2">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
          >
            <Tree item={item} selectedValue={value} onSelect={onSelect} parentPath="" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

interface TreeProps {
  item: TreeItem
  selectedValue?: string | null
  onSelect?: (value: string) => void
  parentPath: string
}

const Tree = ({ item, selectedValue, onSelect, parentPath }: TreeProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [name, ...children] = Array.isArray(item) ? item : [item]
  const currentPath = parentPath ? `${parentPath}/${name}` : name

  if (!children.length) {
    const isSelected = selectedValue === currentPath

    return (
      <motion.div
        whileHover={{ x: 2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onSelect?.(currentPath)}
          className={`w-full justify-start gap-2 px-2 py-1.5 text-sm font-medium transition-all duration-300 group relative overflow-hidden
            ${
              isSelected
                ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 backdrop-blur-sm"
                : "hover:bg-accent/50 hover:text-accent-foreground hover:shadow-sm"
            }
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/5 before:to-transparent 
            before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%]
          `}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10"
          >
            <FileIcon className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <span className="truncate text-left relative z-10">{name}</span>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse"
            />
          )}
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <motion.div
            whileHover={{ x: 2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 px-2 py-1.5 text-sm font-medium transition-all duration-300 group relative overflow-hidden
                hover:bg-accent/50 hover:text-accent-foreground hover:shadow-sm
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-accent/10 before:to-transparent 
                before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%]
              "
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                whileHover={{ scale: 1.1 }}
              >
                <ChevronRightIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, rotate: -5 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                <FolderIcon
                  className={`h-4 w-4 shrink-0 transition-colors duration-300 ${
                    isOpen ? "text-amber-500" : "text-amber-600 dark:text-amber-400"
                  }`}
                />
              </motion.div>
              <span className="truncate text-left">{name}</span>
            </Button>
          </motion.div>
        </CollapsibleTrigger>

        <CollapsibleContent forceMount>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div
                  className="ml-4 border-l border-border/40 pl-4 space-y-0.5 mt-1 relative
                  before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px 
                  before:bg-gradient-to-b before:from-primary/20 before:via-primary/10 before:to-transparent
                "
                >
                  {(item as TreeItem[]).slice(1).map((subitem: TreeItem, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03, ease: "easeOut" }}
                    >
                      <Tree item={subitem} selectedValue={selectedValue} onSelect={onSelect} parentPath={currentPath} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  )
}
