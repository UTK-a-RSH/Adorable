"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { MessageContainer } from "../components/message-container";
import { useState, Suspense } from "react";
import Link from "next/link";
import { Fragment } from "@/generated/prisma";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/fragment-web";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileExplorer } from "@/components/file-explorer";



interface Props {
    projectId: string;
}

export const ProjectView = ({projectId }: Props) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);  
    const [tabState, setTabState] = useState<"preview" | "code">("preview");
    const trpc = useTRPC();
    const {data: project} = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id: projectId,
    }))
    
    return (
    <div className="h-screen w-full bg-gray-50 overflow-hidden">
        <ResizablePanelGroup
                    direction="horizontal"
                    className="h-full w-full border rounded-lg shadow-sm bg-white"
                >
                    <ResizablePanel
                        defaultSize={25}
                        minSize={15}
                        collapsible
                        className="p-6 border-r border-gray-200 bg-gray-50/50 flex flex-col"
                    >
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex-shrink-0">Project Details</h2>
                        <div className="flex-1 min-h-0 overflow-auto">
                            <pre className="bg-white p-4 rounded-lg border text-sm text-gray-700 shadow-sm">
            {JSON.stringify(project, null, 2)}
                            </pre>
                        </div>
                    </ResizablePanel>

                    {/* Draggable handle */}
                    <ResizableHandle withHandle className="bg-gray-200 hover:bg-blue-300 transition-colors" />

                    <ResizablePanel
                        defaultSize={activeFragment ? 40 : 75}
                        minSize={25}
                        collapsible
                        className="flex flex-col bg-white min-h-0"
                    >
                        <div className="p-4 border-b border-gray-200 bg-gray-50/30 flex-shrink-0">
                            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
                        </div>
                        <div className="flex-1 p-4 min-h-0 flex flex-col overflow-hidden">
                            <div className="flex-shrink-0">
                                <ProjectHeader projectId={projectId} />
                            </div>
                            <div className="flex-1 min-h-0 overflow-hidden">
                                <Suspense
                                    fallback={
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                                <p className="text-gray-600">Loading messages...</p>
                                            </div>
                                        </div>
                                    }
                                >
                                    <MessageContainer projectId={projectId} activeFragment={activeFragment} setActiveFragment={setActiveFragment} />
                                </Suspense>
                            </div>
                        </div>
                    </ResizablePanel>

                    {/* Fragment panel - only show when there's an active fragment */}
                    {activeFragment && (
                                            <>
                                                <ResizableHandle withHandle className="bg-gray-200 hover:bg-blue-300 transition-colors" />
                                                <ResizablePanel 
                                                    defaultSize={35} 
                                                    minSize={20}
                                                    collapsible
                                                    className="bg-gray-50 min-h-0"
                                                >
                                                    <Tabs value={tabState} onValueChange={(value) => setTabState(value as "preview" | "code")} className="h-full flex flex-col">
                                                        <div className="flex items-center justify-between m-4 mb-0 flex-shrink-0">
                                                            <TabsList>
                                                                <TabsTrigger value="preview" className="flex items-center gap-2">
                                                                    <Eye size={16} />
                                                                    Preview
                                                                </TabsTrigger>
                                                                <TabsTrigger value="code" className="flex items-center gap-2">
                                                                    <Code size={16} />
                                                                    Code
                                                                </TabsTrigger>
                                                            </TabsList>
                                                            <Link href="/pricing">
                                                                <Button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                                    Upgrade
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                        <TabsContent value="preview" className="flex-1 m-4 mt-2 min-h-0 overflow-auto">
                                                            <FragmentWeb data={activeFragment} />
                                                        </TabsContent>
                                                        <TabsContent value="code" className="flex-1 m-4 mt-2 min-h-0 overflow-auto">
                                                            {!!activeFragment?.files && (
                                                                <FileExplorer files={activeFragment.files as {[path: string]: string}} />
                                                            )}
                                                        </TabsContent>
                                                    </Tabs>
                                                </ResizablePanel>
                                            </>
                                        )}
                </ResizablePanelGroup>
    </div>
    );
}