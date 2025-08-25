"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import { MessageContainer } from "../components/message-container"
import { useState, Suspense } from "react"
import Link from "next/link"
import type { Fragment } from "@/generated/prisma"
import { ProjectHeader } from "../components/project-header"
import { FragmentWeb } from "../components/fragment-web"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileExplorer } from "@/components/file-explorer"

interface Props {
  projectId: string
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)
  const [tabState, setTabState] = useState<"preview" | "code">("preview")
  const trpc = useTRPC()
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({
      id: projectId,
    }),
  )

  return (
    <div className="h-screen w-full bg-background">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full"
      >
        {/* Left Panel - Project Details */}
        <ResizablePanel
          defaultSize={25}
          minSize={15}
          collapsible
          className="flex flex-col border-r border-border"
        >
          <div className="p-4 border-b border-border flex-shrink-0">
            <h2 className="text-lg font-semibold text-foreground">
              Project Details
            </h2>
          </div>
          <div className="flex-1 min-h-0 overflow-auto p-4">
            <pre className="bg-card p-4 rounded-lg border text-sm text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">
              {JSON.stringify(project, null, 2)}
            </pre>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Center Panel - Messages */}
        <ResizablePanel
          defaultSize={activeFragment ? 40 : 75}
          minSize={25}
          collapsible
          className="flex flex-col"
        >
          <div className="p-4 border-b border-border flex-shrink-0">
            <h2 className="text-lg font-semibold text-foreground">
              Messages
            </h2>
          </div>
          <div className="flex-1 min-h-0 flex flex-col p-4 gap-4">
            <div className="flex-shrink-0">
              <ProjectHeader projectId={projectId} />
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
                      <p className="text-muted-foreground">Loading messages...</p>
                    </div>
                  </div>
                }
              >
                <MessageContainer
                  projectId={projectId}
                  activeFragment={activeFragment}
                  setActiveFragment={setActiveFragment}
                />
              </Suspense>
            </div>
          </div>
        </ResizablePanel>

        {/* Right Panel - Fragment Preview/Code */}
        {activeFragment && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={35}
              minSize={20}
              collapsible
              className="flex flex-col border-l border-border"
            >
              <Tabs
                value={tabState}
                onValueChange={(value) => setTabState(value as "preview" | "code")}
                className="h-full flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                  <TabsList>
                    <TabsTrigger
                      value="preview"
                      className="flex items-center gap-2"
                    >
                      <Eye size={16} />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger
                      value="code"
                      className="flex items-center gap-2"
                    >
                      <Code size={16} />
                      Code
                    </TabsTrigger>
                  </TabsList>
                  <Link href="/pricing">
                    <Button size="sm">
                      Upgrade
                    </Button>
                  </Link>
                </div>
                
                <TabsContent
                  value="preview"
                  className="flex-1 min-h-0 p-4"
                >
                  <div className="h-full">
                    <FragmentWeb data={activeFragment} />
                  </div>
                </TabsContent>
                
                <TabsContent
                  value="code"
                  className="flex-1 min-h-0 p-4"
                >
                  {!!activeFragment?.files && (
                    <div className="h-full">
                      <FileExplorer files={activeFragment.files as { [path: string]: string }} />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  )
}