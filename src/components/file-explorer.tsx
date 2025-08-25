"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import { CodeView } from "./code-view/index"
import { TreeView } from "./tree-view"
import Hint from "./hints"
import { CopyIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Fragment, useCallback, useMemo, useState } from "react"
import { convertFilesToTreeItems } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

type FileCollection = {
  [path: string]: string
}

function getLanguageFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase()
  return extension || "text"
}

interface FileExplorerProps {
  files: FileCollection
}

interface FileBreadCrumbProps {
  filePath: string
}

const FileBreadCrumb = ({ filePath }: FileBreadCrumbProps) => {
  const parts = filePath.split("/")
  const maxSegments = 4
  const pathSegments = parts.slice(-maxSegments)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex-shrink-0 p-3 border-b border-border bg-muted/30 backdrop-blur-sm relative overflow-hidden
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/5 before:to-transparent
  "
    >
      <Breadcrumb>
        <BreadcrumbList>
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1
            return (
              <Fragment key={index}>
                <BreadcrumbItem>
                  {isLast ? (
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                      <BreadcrumbPage className="font-medium text-foreground">{segment}</BreadcrumbPage>
                    </motion.div>
                  ) : (
                    <span className="text-muted-foreground transition-colors duration-200 hover:text-foreground">
                      {segment}
                    </span>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="text-muted-foreground/50" />}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </motion.div>
  )
}

export const FileExplorer = ({ files }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files)
    return fileKeys.length > 0 ? fileKeys[0] : null
  })

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files)
  }, [files])

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) {
        setSelectedFile(filePath)
      }
    },
    [files],
  )

  return (
    <div className="h-full overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel
          defaultSize={30}
          minSize={20}
          collapsible
          className="flex flex-col bg-sidebar border-r border-border"
        >
          <motion.div
            className="p-3 border-b border-border bg-muted/50 flex-shrink-0 relative overflow-hidden
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/5 before:to-transparent
    "
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h3 className="font-medium text-sm text-foreground">Files</h3>
          </motion.div>
          <motion.div
            className="flex-1 min-h-0 overflow-auto p-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          >
            <TreeView data={treeData} value={selectedFile} onSelect={handleFileSelect} />
          </motion.div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="bg-border hover:bg-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
        />

        <ResizablePanel defaultSize={70} minSize={30} className="flex flex-col bg-background min-h-0">
          <AnimatePresence mode="wait">
            {selectedFile && files[selectedFile] ? (
              <motion.div
                key={selectedFile}
                className="flex flex-col h-full"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <FileBreadCrumb filePath={selectedFile} />

                <motion.div
                  className="flex items-center justify-between p-3 border-b border-border bg-muted/30 flex-shrink-0 relative overflow-hidden
           before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/5 before:to-transparent
         "
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                >
                  <span className="text-sm font-medium text-foreground">{selectedFile.split("/").pop()}</span>
                  <Hint text="Copy file content">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                      <Button asChild variant="ghost" size="sm" onClick={() => {
                          navigator.clipboard.writeText(files[selectedFile])
                        }}
                        className="hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-sm"
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Hint>
                </motion.div>

                <motion.div
                  className="flex-1 min-h-0 overflow-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                >
                  <CodeView code={files[selectedFile]} language={getLanguageFromExtension(selectedFile)} />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center justify-center h-full text-muted-foreground"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <motion.p
                      className="text-lg font-medium text-foreground"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      Select a file to view
                    </motion.p>
                    <p className="text-sm text-muted-foreground mt-1">Choose a file from the explorer</p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
