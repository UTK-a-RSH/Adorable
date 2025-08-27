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
import { Eye, Code, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileExplorer } from "@/components/file-explorer"
import { UseControl } from "@/components/use-control"
import { Spinner} from "@/components/ui/spinner"
import { SpinnerT } from "@/components/ui/spinnerT"
import { useAuth } from "@clerk/nextjs"
import { ErrorBoundary } from "react-error-boundary"

interface Props {
  projectId: string
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)
  const [tabState, setTabState] = useState<"preview" | "code">("preview")
  const trpc = useTRPC()
  const {has} = useAuth();
  const hasProAccess = has?.({plan: "pro"});
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

        {/* Center Panel - Messages */}
        <ResizablePanel
          defaultSize={activeFragment ? 40 : 75}
          minSize={25}
          collapsible
          className="flex flex-col"
        >
          <div className="flex-1 min-h-0 flex flex-col p-4 gap-4">
            <div className="flex-shrink-0">
              <ProjectHeader projectId={projectId} />
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
                <ErrorBoundary fallback={<p>Something went wrong</p>}>
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-full bg-background">
                      <span className="block dark:hidden">
                        <Spinner />
                      </span>
                    <span className="hidden dark:block">
                      <SpinnerT />
                    </span>
                    </div>
                  }
                >
                  <MessageContainer
                  projectId={projectId}
                  activeFragment={activeFragment}
                  setActiveFragment={setActiveFragment}
                  />
                </Suspense>
                </ErrorBoundary>
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
                 {!hasProAccess && (
                   <Link href="/pricing">
                     <Button size="sm" className="flex items-center gap-2">
                       <Crown className="h-4 w-4" />
                       Upgrade
                     </Button>
                   </Link>
                 )}
                  <UseControl />
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