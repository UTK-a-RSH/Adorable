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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-1 p-2">
        {data.map((item, index) => (
          <Tree key={index} item={item} selectedValue={value} onSelect={onSelect} parentPath="" />
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
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ x: 4 }}
      >
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onSelect?.(currentPath)}
          className={`w-full justify-start gap-2 px-2 py-1.5 text-sm font-medium transition-all duration-200 hover:bg-accent/50 ${
            isSelected 
              ? "bg-accent text-accent-foreground shadow-sm" 
              : "hover:bg-muted/50"
          }`}
        >
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
            <FileIcon className="h-4 w-4 shrink-0 text-blue-600" />
          </motion.div>
          <span className="truncate text-left">{name}</span>
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -5 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 px-2 py-1.5 text-sm font-medium transition-all duration-200 hover:bg-muted/50"
          >
            <motion.div 
              animate={{ rotate: isOpen ? 90 : 0 }} 
              transition={{ duration: 0.2 }}
            >
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-600" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
              <FolderIcon className="h-4 w-4 shrink-0 text-amber-600" />
            </motion.div>
            <span className="truncate text-left">{name}</span>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent forceMount>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-4 border-l border-border/40 pl-4 space-y-1 mt-1">
                  {(item as TreeItem[]).slice(1).map((subitem: TreeItem, index: number) => (
                    <Tree
                      key={index}
                      item={subitem}
                      selectedValue={selectedValue}
                      onSelect={onSelect}
                      parentPath={currentPath}
                    />
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